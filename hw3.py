from functools import reduce

square = lambda x: x**2
add = lambda x,y: x+y
subtract = lambda x,y: x-y
identity = lambda x: x

def temperature_map(local_temperatures):
    """
    Return a list of the local_temperatures converted to the metric system
    using the conversions on the class website.
    >>> temperature_map([6,10,12.8])
    [-1.1111111111111112, 11.48148148148148, 20.296296296296294]
    >>> temperature_map([17])
    [33.51851851851851]
    >>> temperature_map([-17.0])
    [-73.51851851851853]
    """
    # YOUR CODE GOES HERE #

def cipher_map(english_word):
    """
    Return a translation of the english word into the local language
    using the ciphers on the class website.
    >>> cipher_map('hello')
    'lippu'
    >>> cipher_map('today')
    'xuhec'
    >>> cipher_map('yesterday')
    'ciwxivhec'
    """
   # YOUR CODE GOES HERE #

def bottle_value(value_lt):
    """
    Return the sum of values list, using reduce and NOT USING FOR OR SUM.
    >>> bottle_value([5,10,15,20])
    50
    >>> bottle_value(range(50))
    1225
    >>> bottle_value(range(10,50,2))
    580
    """
    # YOUR CODE GOES HERE #

def filter_words(words_to_check, banned_words):
    """
    Filter out the banned words from words_to_check and return the new list.
    >>> filter_words(["today","is","a","bad","day"],["bad","worse"])
    ['today', 'is', 'a', 'day']
    >>> filter_words(["you","are","a","mean","person"],["mean","evil"])
    ['you', 'are', 'a', 'person']
    >>> filter_words(["you","are","a","mean","person"],["MEAN","evil"])
    ['you', 'are', 'a', 'mean', 'person']
    """
    # YOUR CODE GOES HERE #

def fusion(func1, func2, input1, input2):
    """
    Given that func1 and func2 are functions that can take either 1
    or 2 arguments, return a value following the rules in the writeup.
    >>> fusion(square, square, 1, 5)
    26
    >>> fusion(square, add, 2, 6)
    32
    >>> fusion(add, identity, 7.5, 2)
    4.75
    >>> fusion(add, subtract, 3.5, 9)
    18.0
    """
   # YOUR CODE GOES HERE #

def portal_translator(filename):
    """
    >>> portal_translator('test_file.txt')
    260
    >>> portal_translator('missing_file.txt')
    'File missing_file.txt does not exist.'
    """    
    # YOUR CODE GOES HERE #
