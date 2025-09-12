#!/bin/bash

# Restart Server Script pentru cPanel
# Folosește acest script pentru a reporni serverul Node.js

echo "🔄 Restarting NotificARI Server..."
echo "Date: $(date)"

# Oprește procesele Node.js existente
echo "🛑 Stopping existing Node.js processes..."
pkill -f "node.*index.js" 2>/dev/null || echo "No existing processes found"
sleep 2

# Verifică că toate procesele s-au oprit
REMAINING=$(pgrep -f "node.*index.js" | wc -l)
if [ $REMAINING -gt 0 ]; then
    echo "⚠️  Force killing remaining processes..."
    pkill -9 -f "node.*index.js"
    sleep 2
fi

# Navighează în directorul corect
cd /home/misedain/public_html/server || {
    echo "❌ Error: Cannot access server directory"
    exit 1
}

# Verifică că fișierul index.js există
if [ ! -f "index.js" ]; then
    echo "❌ Error: index.js not found in server directory"
    exit 1
fi

# Pornește serverul în background
echo "🚀 Starting server..."
nohup /home/misedain/nodevenv/public_html/18/bin/node index.js > ../server.log 2>&1 &

# Salvează PID-ul pentru management ulterior
SERVER_PID=$!
echo $SERVER_PID > ../server.pid

# Verifică că serverul s-a pornit
sleep 3
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Server started successfully with PID: $SERVER_PID"
    echo "📝 Logs: /home/misedain/public_html/server.log"
    echo "🌐 Server should be available at: https://misedainspectsrl.ro"
else
    echo "❌ Error: Server failed to start"
    echo "📝 Check logs: /home/misedain/public_html/server.log"
    exit 1
fi

echo "🎉 Restart completed!"