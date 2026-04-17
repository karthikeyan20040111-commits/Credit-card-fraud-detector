import { NextResponse } from 'next/server';

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Try to hit the real Python backend
    try {
      const response = await fetch(`${FASTAPI_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        // timeout after 5 seconds
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn("Backend unavailable, falling back to heuristic engine:", backendError);
    }
    
    // Fallback heuristic engine if backend is down
    const { amount, velocity, location } = body;
    let risk_score = 0;
    
    if (amount > 10000) risk_score += 0.4;
    if (velocity > 5) risk_score += 0.3;
    if (location && ['Unknown', 'HighRiskProxy'].includes(location)) risk_score += 0.3;
    
    risk_score = Math.min(risk_score, 1.0);
    const label = risk_score > 0.75 ? 'fraud' : 'legitimate';
    
    return NextResponse.json({
      risk_score,
      label,
      shap_values: { amount: 0.2, velocity: 0.2, location: 0.1, time: 0 },
      explanation: "Fallback heuristic: Evaluated locally due to backend unavailability.",
      xgb_score: risk_score,
      iso_score: risk_score,
      autoencoder_score: risk_score
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process transaction' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    try {
      const response = await fetch(`${FASTAPI_URL}/transactions`);
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.warn("Backend unavailable, generating mock history...");
    }

    // Mock fallback history
    const fallbackHistory = [
      { id: "1", amount: 150.0, location: "New York", time: "10:30 AM", velocity: 1.2, risk_score: 0.1, label: "legitimate", user_id: "U123" },
      { id: "2", amount: 12500.0, location: "UnknownProxy", time: "03:15 AM", velocity: 8.5, risk_score: 0.88, label: "fraud", user_id: "U999" }
    ];
    return NextResponse.json(fallbackHistory);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
