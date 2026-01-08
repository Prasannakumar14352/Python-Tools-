import sys
import json
import importlib
from logger import log, error, success

def main():
    try:
        payload = json.loads(sys.argv[1])
        script_name = payload["script"]

        log(f"Initializing {script_name} operation ...")

        module = importlib.import_module(f"scripts.{script_name}")
        module.run(payload)

        success("Task completed successfully.")
    except Exception as ex:
        error(str(ex))
        sys.exit(1)

if __name__ == "__main__":
    main()
