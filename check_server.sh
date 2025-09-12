#!/bin/bash

# Server Status Check Script pentru cPanel
# Verifică statusul serverului Node.js

echo "📊 NotificARI Server Status Check"
echo "================================="
echo "Date: $(date)"
echo ""

# Verifică procesele Node.js active
echo "🔍 Checking for Node.js processes..."
NODE_PROCESSES=$(pgrep -f "node.*index.js")

if [ -n "$NODE_PROCESSES" ]; then
    echo "✅ Server is running!"
    echo "Process IDs: $NODE_PROCESSES"
    
    # Afișează detalii despre proces
    echo ""
    echo "📋 Process Details:"
    ps -f -p $NODE_PROCESSES
    
    # Verifică portul 5000
    echo ""
    echo "🌐 Network Status:"
    if command -v netstat >/dev/null 2>&1; then
        netstat -tlnp 2>/dev/null | grep :5000 || echo "Port 5000 not found in netstat"
    fi
    
else
    echo "❌ Server is NOT running!"
fi

# Verifică log-urile recente
echo ""
echo "📝 Recent Logs:"
if [ -f "/home/misedain/public_html/server.log" ]; then
    echo "Last 10 lines from server.log:"
    tail -10 /home/misedain/public_html/server.log
else
    echo "No log file found at /home/misedain/public_html/server.log"
fi

# Verifică PID file
echo ""
echo "📄 PID File Status:"
if [ -f "/home/misedain/public_html/server.pid" ]; then
    SAVED_PID=$(cat /home/misedain/public_html/server.pid)
    echo "Saved PID: $SAVED_PID"
    
    if kill -0 $SAVED_PID 2>/dev/null; then
        echo "✅ PID is active"
    else
        echo "❌ PID is not active (stale PID file)"
    fi
else
    echo "No PID file found"
fi

echo ""
echo "🔗 Quick Actions:"
echo "- To restart server: ./restart_server.sh"
echo "- To view live logs: tail -f /home/misedain/public_html/server.log"
echo "- To stop server: pkill -f 'node.*index.js'"