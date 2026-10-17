import os
import json
import solcx

def compile_contract():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    contract_path = os.path.join(base_dir, "contracts", "AttendanceSystem.sol")
    build_dir = os.path.join(base_dir, "build")
    frontend_dir = os.path.join(base_dir, "frontend")
    os.makedirs(build_dir, exist_ok=True)
    os.makedirs(frontend_dir, exist_ok=True)

    print("Compiling AttendanceSystem.sol with solc 0.8.20...")
    solcx.set_solc_version("0.8.20")
    
    compiled = solcx.compile_files(
        [contract_path],
        output_values=["abi", "bin", "metadata"],
        solc_version="0.8.20"
    )

    contract_id = f"{contract_path}:AttendanceSystem"
    if contract_id not in compiled:
        # Check alternative key
        for k in compiled.keys():
            if "AttendanceSystem" in k:
                contract_id = k
                break

    contract_data = compiled[contract_id]
    abi = contract_data["abi"]
    bytecode = contract_data["bin"]

    artifact = {
        "contractName": "AttendanceSystem",
        "abi": abi,
        "bytecode": bytecode,
        "compiler": "solc 0.8.20"
    }

    # Save build artifact JSON
    json_path = os.path.join(build_dir, "AttendanceSystem.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(artifact, f, indent=2)
    print(f"Artifact saved to: {json_path}")

    # Save frontend ABI JS
    abi_js_path = os.path.join(frontend_dir, "contract_abi.js")
    with open(abi_js_path, "w", encoding="utf-8") as f:
        f.write("// Generated contract ABI for frontend integration\n")
        f.write("const ATTENDANCE_SYSTEM_ABI = ")
        f.write(json.dumps(abi, indent=2))
        f.write(";\n")
        f.write("const ATTENDANCE_SYSTEM_BYTECODE = '0x" + bytecode + "';\n")
    print(f"Frontend ABI exported to: {abi_js_path}")
    print("Compilation successful!")

if __name__ == "__main__":
    compile_contract()
