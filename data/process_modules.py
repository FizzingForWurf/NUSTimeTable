import json
from sys import getsizeof
from os.path import dirname, join

RECORD_LIMIT = 10000  # 10 kilobytes

semesterDataRef = "semesterData"
moduleCodeRef = "moduleCode"
moduleCodeSufRef = "suffix"

inputFileName = "AY2223.json"
outputFileName = "AY2223_processed.json"
current_dir = dirname(__file__)
input_file_path = join(current_dir, "./raw/" + inputFileName)
output_file_path = join(current_dir, "./output/" + outputFileName)

print("Reading input file:", input_file_path)
with open(input_file_path, "r", encoding="utf-8") as inFile:
    modules = json.load(inFile)

results = []
not_offered, large_mods = [], []
for mod in modules:
    # Removes any modules not offered in the AY
    if mod[semesterDataRef] == []:
        not_offered.append(mod)
        continue

    reference = mod[moduleCodeRef]
    mod[moduleCodeSufRef] = []

    # Add suffixes longer than 2 characters
    while len(reference) > 2:
        reference = reference[1:]
        mod[moduleCodeSufRef].append(reference)

    # Ignore module if size greater than 10kB
    if len(str(mod)) > RECORD_LIMIT:
        large_mods.append(mod)
        continue

    results.append(mod)

with open(output_file_path, "w") as outfile:
    json.dump(results, outfile)
print("Completed processing, output:", output_file_path)

print("Modules not offered:", len(not_offered))
for mod in not_offered:
    print(mod[moduleCodeRef], end=",")

print("\nModules too large:", len(large_mods))
for mod in large_mods:
    print(mod[moduleCodeRef], end=",")

print("Remaining modules:", len(results))
