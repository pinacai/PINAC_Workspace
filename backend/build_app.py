"""
Helper script to build the Python backend with PyInstaller
ensuring all dependencies are correctly included.
"""

import subprocess
import sys
import os
import shutil
import platform


def main():
    print("Building Python backend with PyInstaller...")

    # Ensure our environment has all requirements
    print("Installing requirements...")
    subprocess.check_call(
        [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"]
    )

    # Install PyInstaller if not already installed
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])

    # Clean previous build if it exists
    # if os.path.exists("build"):
    #     print("Cleaning previous build directory...")
    #     shutil.rmtree("build")

    # if os.path.exists("dist"):
    #     print("Cleaning previous dist directory...")
    #     shutil.rmtree("dist")

    # Build the executable
    print("Building with PyInstaller...")

    # Use --clean to force a clean rebuild
    # Use --log-level=DEBUG for detailed output if needed
    subprocess.check_call(
        [sys.executable, "-m", "PyInstaller", "--clean", "--log-level=INFO", "app.spec"]
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
            subprocess.check_call(["./" + exe_path, "--help"])
        print("\n✅ Executable test successful!")
    except subprocess.CalledProcessError:
        print("\n❌ Executable test failed. Please check the output above for errors.")


if __name__ == "__main__":
    main()
