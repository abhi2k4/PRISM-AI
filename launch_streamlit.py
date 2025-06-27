"""
PRISM Streamlit Launcher
Simple script to check prerequisites and launch the Streamlit app
"""
import os
import sys
import subprocess
from pathlib import Path

def check_env_file():
    """Check if .env file exists with required configuration"""
    env_path = Path("risk_assessment_agent") / ".env"
    
    if not env_path.exists():
        print("⚠️  WARNING: .env file not found!")
        print(f"Please create {env_path} with your configuration:")
        print("\nExample .env file contents:")
        print("GEMINI_API_KEY=your_actual_api_key_here")
        print("DEFAULT_AI_MODEL=gemini-1.5-flash")
        print("\nYou can get a Gemini API key from: https://makersuite.google.com/app/apikey")
        
        response = input("\nContinue anyway? (y/N): ")
        if response.lower() != 'y':
            return False
    else:
        print("✅ .env file found")
    
    return True

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import streamlit
        import plotly
        import pandas
        print("✅ Core dependencies found")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Installing dependencies...")
        
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements_streamlit.txt"])
            print("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False

def main():
    """Main launcher function"""
    print("🔍 PRISM - Risk Assessment Streamlit Launcher")
    print("=" * 50)
    
    # Check prerequisites
    if not check_env_file():
        sys.exit(1)
    
    if not check_dependencies():
        sys.exit(1)
    
    # Launch Streamlit
    print("\n🚀 Launching PRISM Streamlit Application...")
    print("📱 Open your browser to: http://localhost:8501")
    print("\n✨ To stop the application, press Ctrl+C")
    print("=" * 50)
    
    try:
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "streamlit_app.py",
            "--server.headless", "true",
            "--server.fileWatcherType", "none",
            "--browser.gatherUsageStats", "false"
        ])
    except KeyboardInterrupt:
        print("\n\n👋 PRISM application stopped. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error launching application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
