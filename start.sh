#!/usr/bin/env bash
# ============================================================
#  Career Compass — One-Click Startup Script
#  Usage:  bash start.sh
# ============================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'
BOLD='\033[1m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/Backend"
VENV_DIR="$BACKEND_DIR/venv"

echo ""
echo -e "${CYAN}${BOLD}============================================================${RESET}"
echo -e "${CYAN}${BOLD}         CAREER COMPASS — AGENTIC CAREER COMPANION${RESET}"
echo -e "${CYAN}${BOLD}============================================================${RESET}"
echo ""

# ---- Python check ----
if ! command -v python3 &>/dev/null; then
  echo -e "${RED}ERROR: python3 is not installed. Please install Python 3.9+.${RESET}"
  exit 1
fi

PY_VER=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo -e "  ${GREEN}✓${RESET} Python $PY_VER detected"

# ---- Virtual environment ----
if [ ! -d "$VENV_DIR" ]; then
  echo -e "  ${YELLOW}→${RESET} Creating virtual environment…"
  python3 -m venv "$VENV_DIR"
  echo -e "  ${GREEN}✓${RESET} Virtual environment created"
else
  echo -e "  ${GREEN}✓${RESET} Virtual environment found"
fi

# ---- Activate venv ----
source "$VENV_DIR/bin/activate"

# ---- Install dependencies ----
echo -e "  ${YELLOW}→${RESET} Installing dependencies…"
pip install -q --upgrade pip
pip install -q -r "$BACKEND_DIR/requirements.txt"
echo -e "  ${GREEN}✓${RESET} Dependencies installed"

# ---- Start Flask ----
echo ""
echo -e "${CYAN}${BOLD}------------------------------------------------------------${RESET}"
echo -e "  ${GREEN}${BOLD}Backend URL:${RESET}  http://127.0.0.1:5000"
echo -e "  ${GREEN}${BOLD}Frontend:${RESET}    Open  Frontend/index.html  in your browser"
echo -e "${CYAN}${BOLD}------------------------------------------------------------${RESET}"
echo ""
echo -e "  Press  ${BOLD}Ctrl+C${RESET}  to stop the server."
echo ""

cd "$BACKEND_DIR"
python3 app.py
