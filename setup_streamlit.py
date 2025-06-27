"""
PRISM Setup Script
Installs required dependencies for the Streamlit app
"""
import subprocess
import sys
import os

def install_package(package):
    """Install a Python package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    print("🔍 PRISM Streamlit Setup")
    print("=" * 30)
    
    # Core dependencies
    core_packages = [
        "streamlit>=1.28.0",
        "python-dotenv>=1.0.0",
        "google-generativeai>=0.3.0",
        "pydantic>=2.0.0"
    ]
    
    # Optional dependencies for enhanced features
    optional_packages = [
        "plotly>=5.15.0",
        "pandas>=1.5.0"
    ]
    
    print("Installing core dependencies...")
    for package in core_packages:
        print(f"Installing {package}...")
        if install_package(package):
            print(f"✓ {package} installed successfully")
        else:
            print(f"✗ Failed to install {package}")
            return False
    
    print("\nInstalling optional dependencies...")
    for package in optional_packages:
        print(f"Installing {package}...")
        if install_package(package):
            print(f"✓ {package} installed successfully")
        else:
            print(f"⚠ Failed to install {package} (optional)")
    
    print("\n✅ Setup complete!")
    print("\nNext steps:")
    print("1. Create .env file in risk_assessment_agent/ with your GEMINI_API_KEY")
    print("2. Run: streamlit run streamlit_app.py")
    
    return True

if __name__ == "__main__":
    main()
