import os
import json
from glob import glob

def load_secret_into_env(key, value, subdir):
    os.chdir(subdir)
    os.system(f'wrangler secret put {key} <<< {value}')

def load_secret(config: dict, subdir: str):
    global_config = config['globals']
    for k, v in global_config.items():
        load_secret_into_env(k, v, subdir)
        
def main():
    with open('../squawk.json') as f:
        config = json.load(f)
    workers = [os.path.abspath(w) for w in glob('./*/')]    
    [load_secret(config, os.path.abspath(w)) for w in workers ]
    

if __name__ == '__main__':
    main()