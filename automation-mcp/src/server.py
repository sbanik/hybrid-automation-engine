import asyncio
import subprocess
import json
from mcp.server.models import InitializationOptions
from mcp.server import NotificationOptions, Server
from mcp.server.stdio import stdio_server

# Create the server
server = Server("automation-bridge")

@server.list_tools()
async def handle_list_tools():
    return [
        {
            "name": "run_test",
            "description": "Run a Playwright scenario via the Node engine",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "scenarioId": {"type": "string"},
                },
                "required": ["scenarioId"]
            }
        }
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict):
    if name == "run_test":
        scenario_id = arguments.get("scenarioId")
        
        # Bridge to Node.js: We call your Express API or a direct CLI command
        result = subprocess.run(
            ["node", "../automation-core/dist/cli.js", "run", scenario_id],
            capture_output=True, text=True
        )
        
        return [
            {
                "type": "text",
                "text": f"Execution Output: {result.stdout}"
            }
        ]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="automation-bridge",
                server_version="0.1.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    asyncio.run(main())