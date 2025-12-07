import asyncio
import httpx
import time
import statistics
import json
import os

API_URL = "http://localhost:8000/api/v1"

async def run_benchmark(iterations=50, concurrency=5):
    print(f"🚀 Starting Benchmark: {iterations} requests with concurrency {concurrency}")
    
    async with httpx.AsyncClient() as client:
        # 1. Health Check
        start = time.time()
        resp = await client.get("http://localhost:8000/health")
        if resp.status_code != 200:
            print("❌ Backend not healthy. Is it running?")
            return
        print(f"✅ Health Check passed in {time.time()-start:.4f}s")

        # 2. Create Agent
        agent_payload = {
            "name": "Benchmark Agent",
            "description": "Created for perf testing",
            "graph": {"nodes": [{"id":"1","type":"input"}, {"id":"2","type":"output"}], "edges": [{"source":"1","target":"2"}]}
        }
        resp = await client.post(f"{API_URL}/agents/", json=agent_payload)
        agent_id = resp.json()["id"]
        print(f"✅ Created Benchmark Agent: {agent_id}")

        # 3. Load Test (Run Agent)
        latencies = []
        errors = 0
        
        async def make_request(i):
            t0 = time.time()
            try:
                # Trigger run
                resp = await client.post(f"{API_URL}/agents/{agent_id}/run", json={"input_data": {"input": f"test_{i}"}})
                if resp.status_code == 200:
                    dt = time.time() - t0
                    return dt
                else:
                    return None
            except Exception as e:
                return None

        # Process in chunks of 'concurrency'
        tasks = []
        start_bench = time.time()
        
        for i in range(iterations):
            tasks.append(make_request(i))
            
        results = await asyncio.gather(*tasks)
        total_time = time.time() - start_bench
        
        valid_latencies = [r for r in results if r is not None]
        errors = iterations - len(valid_latencies)
        
        print("\n📊 Results 📊")
        print("------------------------------------------------")
        print(f"Total Requests:      {iterations}")
        print(f"Successful:          {len(valid_latencies)}")
        print(f"Failed:              {errors}")
        print(f"Total Time:          {total_time:.2f}s")
        print(f"Requests/Sec (RPS):  {len(valid_latencies)/total_time:.2f}")
        
        if valid_latencies:
            print(f"Avg Latency:         {statistics.mean(valid_latencies)*1000:.2f}ms")
            print(f"P95 Latency:         {statistics.quantiles(valid_latencies, n=20)[18]*1000:.2f}ms")
            print(f"Min Latency:         {min(valid_latencies)*1000:.2f}ms")
            print(f"Max Latency:         {max(valid_latencies)*1000:.2f}ms")
        print("------------------------------------------------")

        # Generate Report Markdown
        report = f"""# 🚀 Performance Report

**Date**: {time.strftime("%Y-%m-%d %H:%M:%S")}
**Environment**: Local Dev (Docker)

## Summary
- **Total Requests**: {iterations}
- **Concurrency**: {concurrency}
- **Success Rate**: {(len(valid_latencies)/iterations)*100:.1f}%
- **RPS**: {len(valid_latencies)/total_time:.2f} req/s

## Latency Metrics
| Metric | Value |
|--------|-------|
| Average | {statistics.mean(valid_latencies)*1000:.2f} ms |
| P95 | {statistics.quantiles(valid_latencies, n=20)[18]*1000:.2f} ms |
| Min | {min(valid_latencies)*1000:.2f} ms |
| Max | {max(valid_latencies)*1000:.2f} ms |

## detailed Logs
- Endpoint: `{API_URL}/agents/{agent_id}/run`
- Payload: `test_i`
"""
        with open("docs/performance_report.md", "w") as f:
            f.write(report)
        print("\n📄 Report generated at docs/performance_report.md")

if __name__ == "__main__":
    asyncio.run(run_benchmark())
