#!/usr/bin/env python3

'''
Abstract Syntax Trees
01/04/2018

You may override the constants OPERATORS and PRECEDENCE
to define your own grammar. The is_operand() function is 
intended to be redefined as well and is used to determine
if a given token within an expression string is a valid 
operand.

'''
from sys import stdout, modules
from math import inf

# Override these constants
OPERATORS = ['^', '*', '/', '%', '+', '-']
PRECEDENCE = {
    '^': 2,  # raise
    '*': 1,  # multiply
    '/': 1,  # divide
    '%': 1,  # modulo
    '+': 0,  # add
    '-': 0  # subtract
}

# TODO: Implement Operator Associativity
# https://en.wikipedia.org/wiki/Operator_associativity

# Override this function


def is_operand(token):
    '''Returns True if token is a legal operand'''
    try:
        float(token)
        return True
    except (TypeError, ValueError):
        pass
    try:
        import unicodedata
        unicodedata.numeric(token)
        return True
    except (TypeError, ValueError):
        pass
    return False


class AST:
    '''Data structure for an Abstract Syntax Tree'''

    def __init__(self, value, left=None, right=None):
        self.value = value

        if left != None or right != None:
            assert left != None and right != None, \
                'Arguments left and right must both be either present or absent.'

        self.left = None
        if left != None:
            if type(left) == AST:
                self.left = left
            else:
                self.left = AST(left)

        self.right = None
        if right != None:
            if type(right) == AST:
                self.right = right
            else:
                self.right = AST(right)

    def preOrder(self):
        # Value, Left, Right
        result = []
        result.append(self.value)
        if self.left:
            result += self.left.preOrder()
        if self.right:
            result += self.right.preOrder()
        return result

    def inOrder(self):
        # Left, Value, Right
        result = []
        if self.left:
            result += self.left.inOrder()
        result.append(self.value)
        if self.right:
            result += self.right.inOrder()
        return result

    def postOrder(self):
        # Left, Right, Value
        result = []
        if self.left:
            result += self.left.postOrder()
        if self.right:
            result += self.right.postOrder()
        result.append(self.value)
        return result

    def _format(self, _padding=''):
        '''Formats the AST to a string'''

        line = '('+str(self.value)+')\n'

        if self.left:
            line += _padding
            line += ' \u251C'

            # push
            _padding += ' |'

            line += self.left._format(_padding)

            # pop
            _padding = _padding[:-2]

        if self.right:
            line += _padding
            line += ' \u2514'

            # push
            _padding += '  '

            line += self.right._format(_padding)

            # pop
            _padding = _padding[:-2]
        return line

    def format(self):
        return self._format()

    def display(self):
        '''Pretty-prints the AST to the terminal'''
        stdout.write(self.format())

    def printPreOrder(self):
        stdout.write(' '.join(map(str, self.preOrder()))+'\n')

    def printInOrder(self):
        stdout.write(' '.join(map(str, self.inOrder()))+'\n')

    def printPostOrder(self):
        stdout.write(' '.join(map(str, self.postOrder()))+'\n')


def parse(expression):
    '''
    Parses an infix notation expression into an AST 
    using Edsger Dijkstra's Shunting-Yard algorithm.
    There must be whitespace between operands and 
    operators.
    '''
    class Stack:
        '''Data structure for a Stack (LIFO)'''

        def __init__(self, another=None):
            self.list = []
            if another:
                self.list = another.list

        def push(self, val):
            self.list.append(val)

        def pop(self):
            return self.list.pop() if self.list else None

        def peek(self):
            return self.list[-1] if self.list else None

        def isEmpty(self):
            return False if self.list else True

        def size(self):
            return len(self.list)

        def display(self):
            print(self.list)

    def next_token(expression):
        ''' 
        Returns a tuple (expression, token).
        Tokens are either some string or an
        open/closed parenthesis.
        The expression returned is updated to reflect
        the new expression without the token that was
        just found.
        '''
        exp = expression.strip()
        end = 0
        previous = ''
        for c in exp:
            if c == ' ':
                break
            elif c == '(' or c == ')':
                if end == 0:
                    end = 1
                    break
                else:
                    break
            else:
                end += 1
        return exp[end:], exp[0:end]

    ERROR_MESSAGE = 'Unable to parse \''+expression+'\''

    global PRECEDENCE
    PARENTHESIS = {'(': inf, ')': inf}
    PRECEDENCE = {**PRECEDENCE, **PARENTHESIS}

    op_stack = Stack()
    exp_stack = Stack()
    exp, token = next_token('('+expression+')')

    while token:
        if token == '(':
            op_stack.push(token)

        elif is_operand(token):
            exp_stack.push(AST(token))

        elif token in OPERATORS:
            while op_stack.size():
                if op_stack.peek() == '(':
                    break
                if PRECEDENCE[op_stack.peek()] < PRECEDENCE[token]:
                    break

                op = op_stack.pop()
                e2 = exp_stack.pop()
                e1 = exp_stack.pop()
                exp_stack.push(AST(op, e1, e2))

            op_stack.push(token)

        elif token == ')':
            while op_stack.size():
                if op_stack.peek() == '(':
                    break

                op = op_stack.pop()
                e2 = exp_stack.pop()
                e1 = exp_stack.pop()
                exp_stack.push(AST(op, e1, e2))

            # Pop the '(' off the operator stack.
            op_stack.pop()

        else:
            raise RuntimeError(ERROR_MESSAGE)

        # Grab the next token
        exp, token = next_token(exp)

    # Only one item should be left on the expression stack
    assert exp_stack.size() == 1, \
        ('The expression stack is expected to be of size 1 '
         'after applying the Shunting-Yard algorithm. ' + ERROR_MESSAGE)

    # Return the root node
    return exp_stack.pop()


def main():
    t1 = parse('3 - 4 + 5')
    t1.printPreOrder()


main()
