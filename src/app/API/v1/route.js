// this route would handle crud operation for all questions

import connectionPool from "@/app/db/connection";

export async function GET() {
  try {
    // get all questions
    const [questions] = await connectionPool.query("select * from questions");
    return new Response(JSON.stringify(questions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "database query error" }), {
      status: 500,
    });
  }
}

