import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 10000 }, // Ramp-up to 10k users
    { duration: '5m', target: 50000 }, // Ramp-up to 50k users
    { duration: '10m', target: 200000 }, // Peak at 200k users
    { duration: '5m', target: 0 }, // Scale down
  ],
};

export default function () {
  // Simulate fetching the homepage
  const res = http.get('https://YOUR_PRODUCTION_URL/');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'latency < 200ms': (r) => r.timings.duration < 200,
  });

  // Simulate reading public publishers data
  const apiRes = http.get('https://YOUR_PRODUCTION_URL/api/publishers');
  check(apiRes, {
    'api status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
