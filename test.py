def filter_possible_words(guesses, words):
    if not guesses:
        return []  # 如果没有猜测记录，直接返回空列表
    
    valid_words = []
    
    for word in words:
        is_valid = True
        for guess in guesses:
            letter = guess['letter'].lower()
            position = guess['position']
            state = guess['state']
            
            if state == 'correct' and word[position] != letter:
                is_valid = False
                break

            if state == 'present':
                if letter not in word:
                    is_valid = False
                    break
                if word[position] == letter:
                    is_valid = False
                    break

            if state == 'absent' and letter in word:
                is_valid = False
                break
        
        if is_valid:
            valid_words.append(word)
    
    return valid_words

# 读取words.txt文件中的单词
def load_words_from_file(file_path='words.txt'):
    with open(file_path, 'r') as file:
        return [word.strip().lower() for word in file.readlines()]

# 示例猜测记录
guesses = [
    {'letter': 'C', 'state': 'absent', 'position': 0},
    {'letter': 'R', 'state': 'present', 'position': 1},
    {'letter': 'A', 'state': 'absent', 'position': 2},
    {'letter': 'N', 'state': 'absent', 'position': 3},
    {'letter': 'E', 'state': 'present', 'position': 4},
    
    {'letter': 'B', 'state': 'absent', 'position': 0},
    {'letter': 'O', 'state': 'absent', 'position': 1},
    {'letter': 'X', 'state': 'absent', 'position': 2},
    {'letter': 'E', 'state': 'correct', 'position': 3},
    {'letter': 'R', 'state': 'correct', 'position': 4},
    
    {'letter': 'D', 'state': 'present', 'position': 0},
    {'letter': 'E', 'state': 'absent', 'position': 1},
    {'letter': 'F', 'state': 'absent', 'position': 2},
    {'letter': 'E', 'state': 'correct', 'position': 3},
    {'letter': 'R', 'state': 'correct', 'position': 4}
]

# 假设words.txt包含这些单词
words = load_words_from_file()

# 调用函数筛选符合条件的单词
valid_words = filter_possible_words(guesses, words)
print(valid_words)