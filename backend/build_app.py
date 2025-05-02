"""
Helper script to build the Python backend with PyInstaller
ensuring all dependencies are correctly included.
"""

import subprocess
import sys
import os
import platform
# import shutil

# Determine the path to the venv Python executable
backend_dir = os.path.dirname(os.path.abspath(__file__))
venv_dir = os.path.join(backend_dir, "venv")

if platform.system() == "Windows":
    python_executable = os.path.join(venv_dir, "Scripts", "python.exe")
else:
    python_executable = os.path.join(venv_dir, "bin", "python")

# Check if the venv Python executable exists
if not os.path.exists(python_executable):
    print(
        f"Error: Virtual environment Python executable not found at {python_executable}"
    )
    print(
        "Please ensure the virtual environment 'venv' exists in the 'backend' directory and is activated."
    )
    sys.exit(1)

print(f"Using Python executable from venv: {python_executable}")


def main():
    print("Building Python backend with PyInstaller...")

    # Ensure our environment has all requirements
    print("Installing requirements using venv...")
    subprocess.check_call(
        [python_executable, "-m", "pip", "install", "-r", "requirements.txt"]
    )

    # Install PyInstaller if not already installed in venv
    subprocess.check_call([python_executable, "-m", "pip", "install", "pyinstaller"])

    # Clean previous build if it exists
    # if os.path.exists("build"):
    #     print("Cleaning previous build directory...")
    #     shutil.rmtree("build")

    # if os.path.exists("dist"):
    #     print("Cleaning previous dist directory...")
    #     shutil.rmtree("dist")

    # Build the executable using venv's PyInstaller
    print("Building with PyInstaller using venv...")

    # Use --clean to force a clean rebuild
    # Use --log-level=DEBUG for detailed output if needed
    subprocess.check_call(
        [
            python_executable,
            "-m",
            "PyInstaller",
            "--clean",
            "--log-level=INFO",
            "app.spec",
        ]
    )

    print("\nBuild completed!")

    # Output the location of the executable
    if platform.system() == "Windows":
        exe_path = os.path.abspath(os.path.join("dist", "app.exe"))
    else:
        exe_path = os.path.abspath(os.path.join("dist", "app"))

    print(f"\nExecutable created at: {exe_path}")

    # Test the executable
    print("\nAttempting to run the executable to verify it works...")
    try:
        # Run with --help to test without actually starting the server
        if platform.system() == "Windows":
            subprocess.check_call([exe_path, "--help"])
        else:
            subprocess.check_call([exe_path, "--help"])
        print("\n✅ Executable test successful!")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Executable test failed. Error: {e}")
        print("Please check the output above for errors.")
        sys.exit(1)  # Exit if test fails
    except FileNotFoundError:
        print(f"\n❌ Executable test failed. File not found: {exe_path}")
        sys.exit(1)  # Exit if file not found


if __name__ == "__main__":
    main()
