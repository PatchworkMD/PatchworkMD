#!/usr/bin/env python3
import json
import os
import re
import shlex
import subprocess
import sys

DEFAULT_BRANCHES = {'main', 'master'}
WRAPPERS = {'env', 'command', 'sudo', 'time', 'nohup', 'exec'}
SEPARATORS = {';', '&&', '||', '|', '&', '(', ')', '{', '}'}
GIT_OPTIONS_WITH_VALUE = {'-C', '-c', '--git-dir', '--work-tree', '--namespace'}
PUSH_DANGEROUS_LONG = {'--mirror', '--all', '--branches', '--delete', '--prune'}
PUSH_DANGEROUS_SHORT = set('fd')
PUSH_OPTIONS_WITH_VALUE = {'--repo', '--push-option', '--receive-pack', '--exec'}
PUSH_SHORT_WITH_VALUE = set('o')
MUTATING_HINT = re.compile(
    r'\b(git|gh)\b.*\b(push|merge|reset|clean|branch|checkout|restore)\b'
)


def block(reason):
    print(
        f'BLOCKED: {reason}. Branches and PRs only; Austin merges.',
        file=sys.stderr,
    )
    sys.exit(2)


def segments(command):
    for line in command.splitlines():
        lexer = shlex.shlex(line, posix=True, punctuation_chars=';&|(){}')
        lexer.whitespace_split = True
        current = []
        for token in lexer:
            if token in SEPARATORS:
                if current:
                    yield current
                current = []
            else:
                current.append(token)
        if current:
            yield current


def strip_wrappers(tokens):
    while tokens and (tokens[0] in WRAPPERS or re.match(r'^\w+=', tokens[0])):
        tokens = tokens[1:]
    return tokens


def git_subcommand(tokens, cwd):
    rest = tokens[1:]
    while rest and rest[0].startswith('-'):
        option = rest.pop(0)
        if option in GIT_OPTIONS_WITH_VALUE and rest:
            value = rest.pop(0)
            if option == '-C':
                cwd = os.path.join(cwd or '.', value)
        elif option.startswith('-C') and len(option) > 2:
            cwd = os.path.join(cwd or '.', option[2:])
    return (rest[0], rest[1:], cwd) if rest else (None, [], cwd)


def destination(refspec):
    target = refspec.split(':')[-1]
    return target.removeprefix('refs/heads/')


def current_branch(cwd):
    result = subprocess.run(
        ['git', '-C', cwd or '.', 'symbolic-ref', '--short', 'HEAD'],
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def parse_push(args):
    remote_given = False
    dangerous = False
    positional = []
    rest = list(args)
    while rest:
        arg = rest.pop(0)
        if arg == '--':
            positional.extend(rest)
            break
        if arg.startswith('--'):
            name, has_value, _ = arg.partition('=')
            if name in PUSH_OPTIONS_WITH_VALUE and not has_value and rest:
                rest.pop(0)
            remote_given = remote_given or name == '--repo'
            dangerous = (
                dangerous
                or name in PUSH_DANGEROUS_LONG
                or name.startswith('--force')
            )
        elif arg.startswith('-') and len(arg) > 1:
            for index, flag in enumerate(arg[1:]):
                dangerous = dangerous or flag in PUSH_DANGEROUS_SHORT
                if flag in PUSH_SHORT_WITH_VALUE:
                    if index == len(arg) - 2 and rest:
                        rest.pop(0)
                    break
        else:
            positional.append(arg)
    refspecs = positional if remote_given else positional[1:]
    return dangerous, refspecs


def check_push(args, cwd):
    dangerous, refspecs = parse_push(args)
    if dangerous:
        block('force, mirror, delete, prune, or all-branch push')
    if any(spec.startswith('+') for spec in refspecs):
        block('forced refspec')
    if any(destination(spec) in DEFAULT_BRANCHES for spec in refspecs):
        block('push to the default branch')
    if not refspecs and current_branch(cwd) in DEFAULT_BRANCHES:
        block('push from the default branch')


def check_git(args, cwd):
    subcommand, rest, cwd = git_subcommand(args, cwd)
    if subcommand == 'push':
        check_push(rest, cwd)
    elif subcommand == 'merge':
        block('local merge')
    elif subcommand == 'reset' and '--hard' in rest:
        block('hard reset')
    elif subcommand == 'clean' and any(
        a == '--force' or re.match(r'^-[a-zA-Z]*f', a) for a in rest
    ):
        block('forced clean')
    elif subcommand == 'branch' and (
        '-D' in rest or ('--delete' in rest and '--force' in rest)
    ):
        block('forced branch delete')
    elif subcommand in {'checkout', 'restore'} and '.' in rest:
        block('discarding working-tree changes')


def check(command, cwd):
    for tokens in segments(command):
        tokens = strip_wrappers(tokens)
        if not tokens:
            continue
        program = tokens[0].rsplit('/', 1)[-1]
        if program in {'bash', 'sh', 'zsh'} and '-c' in tokens:
            index = tokens.index('-c') + 1
            if index < len(tokens):
                check(tokens[index], cwd)
        elif program == 'git':
            check_git(tokens, cwd)
        elif program == 'gh' and tokens[1:3] == ['pr', 'merge']:
            block('pull request merge')


def main():
    try:
        payload = json.load(sys.stdin)
        command = payload.get('tool_input', {}).get('command', '')
        cwd = payload.get('cwd')
    except (json.JSONDecodeError, AttributeError):
        block('unreadable hook input')
    try:
        check(command, cwd)
    except ValueError:
        if MUTATING_HINT.search(command):
            block('unparseable command that may mutate Git state')


main()
