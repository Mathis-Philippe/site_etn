import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: "Déconnexion réussie" }, { status: 200 });
  
  response.cookies.delete('token');
  
  return response;
}