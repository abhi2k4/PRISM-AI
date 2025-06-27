"""
PRISM Streamlit App - Simple Test
This tests if the app can run with minimal dependencies
"""
import sys
import os

def test_imports():
    """Test if core imports work"""
    print("Testing imports...")
    
    try:
        import streamlit as st
        print("✓ Streamlit imported successfully")
    except ImportError as e:
        print(f"✗ Streamlit import failed: {e}")
        return False
    
    # Test optional imports
    try:
        import plotly
        print("✓ Plotly available")
    except ImportError:
        print("⚠ Plotly not available (charts will be simplified)")
    
    try:
        import pandas
        print("✓ Pandas available")
    except ImportError:
        print("⚠ Pandas not available (CSV export will be basic)")
    
    # Test risk assessment modules
    current_dir = os.path.dirname(os.path.abspath(__file__))
    risk_agent_dir = os.path.join(current_dir, 'risk_assessment_agent')
    sys.path.insert(0, risk_agent_dir)
    
    try:
        from models import RiskAssessmentRequest
        from risk_agent import RiskAssessmentAgent
        print("✓ Risk assessment modules imported successfully")
    except ImportError as e:
        print(f"⚠ Risk assessment modules not available: {e}")
        print("  This is expected if running without the full PRISM setup")
    
    return True

def test_app_structure():
    """Test if the app file structure is correct"""
    print("\nTesting app structure...")
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Check main app file
    app_file = os.path.join(current_dir, 'streamlit_app.py')
    if os.path.exists(app_file):
        print("✓ streamlit_app.py found")
    else:
        print("✗ streamlit_app.py not found")
        return False
    
    # Check risk assessment directory
    risk_dir = os.path.join(current_dir, 'risk_assessment_agent')
    if os.path.exists(risk_dir):
        print("✓ risk_assessment_agent directory found")
        
        # Check for key files
        key_files = ['models.py', 'risk_agent.py']
        for file in key_files:
            file_path = os.path.join(risk_dir, file)
            if os.path.exists(file_path):
                print(f"✓ {file} found")
            else:
                print(f"⚠ {file} not found")
        
        # Check for .env file
        env_file = os.path.join(risk_dir, '.env')
        if os.path.exists(env_file):
            print("✓ .env file found")
        else:
            print("⚠ .env file not found (create this with your GEMINI_API_KEY)")
    else:
        print("⚠ risk_assessment_agent directory not found")
    
    return True

def main():
    """Main test function"""
    print("🔍 PRISM Streamlit App Test")
    print("=" * 40)
    
    if not test_imports():
        print("\n❌ Import test failed")
        return
    
    if not test_app_structure():
        print("\n❌ Structure test failed")
        return
    
    print("\n✅ Basic tests passed!")
    print("\nTo run the app:")
    print("1. Install dependencies: pip install streamlit")
    print("2. For full features: pip install -r requirements_streamlit.txt")
    print("3. Run: streamlit run streamlit_app.py")

if __name__ == "__main__":
    main()
