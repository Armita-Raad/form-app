// this route would handle crud operation for individual questions

import { connectionPool } from "@/app/db/connection";
import { v4 as uuid } from "uuid";

// get single question by id
export async function GET(req) {
  const { id } = params;
  try {
    const [question] = await connectionPool.query(
      "select * from questions where question_id = ?",
      [id]
    );

    if (question.length === 0) {
      return new Response(JSON({ error: "question not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(question), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "database query error", details: error.message })
    );
  }
}

// delete question by id
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    const [deleteQuestion] = connectionPool.query(
      "delete from questions where question_id = ?",
      [id]
    );

    if (deleteQuestion.affectedRows === 0) {
      return new Response(JSON.stringify({ error: "question not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "question deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "database deletion error",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}

// update questions
export async function PATCH(req, { params }) {
  const { id } = params;
  const { question_text, options } = await req.json();

  if (!question_text || !options) {
    return new Response(JSON.stringify({ error: "all fields are required" }), {
      status: 400,
    });
  }

  try {
    // update question text
    await connectionPool.query(
      "update questions set question_text =? where question_id = ?",
      [question_text, id]
    );

    // updating options
    const optionsToUpdate = [];
    const newOptions = [];

    for (const option of options) {
      if (option.option_id) {
        optionsToUpdate.push(option);
      } else {
        newOptions.push(option);
      }
    }

    // update existing options
    for (const option of optionsToUpdate) {
      const { option_id, option_text, is_correct } = option;

      await connectionPool.query(
        "update options set option_text =?, is_correct=? where option_id=? and question_id=?",
        [option_text, is_correct ? 1 : 0, option_id, id]
      );
    }

    // insert new options
    for (const option of newOptions) {
      const { option_text, is_correct } = option;

      await connectionPool.query(
        "insert into options(question_id, option_text, is_correct) values(?,?,?)",
        [id, option_text, is_correct ? 1 : 0]
      );
    }

    // omit the options that user deleted
    const [existingOptions] = await connectionPool.query(
      "select option_id from options where question_id=?",
      [id]
    );
    const existingOptionIds = existingOptions.map((option) => option.option_id);

    const updateOptionsIds = optionsToUpdate.map((i) => i.option_id);

    const optionsToDelete = existingOptionIds.filter(
      (i) => !updateOptionsIds.includes(i)
    );

    if (optionsToDelete.length > 0) {
      for (const option of optionsToDelete) {
        await connectionPool.query(
          "delete from options where option_id in (?) and question_id=?",
          [option, id]
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "question updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "database update error",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}

// create new question and options

export async function POST(req) {
  const body = await req.json();
  const { form_id, question_text, question_type, options } = body;
  const question_id = uuid();

  if (!form_id || !question_text || !question_type) {
    return new Response(JSON.stringify({ error: "all fields are required" }), {
      status: 400,
    });
  }

  try {
    // insert new question to the questions table
    await connectionPool.query(
      "insert into questions (question_id,form_id, question_text, question_type) values (?,?,?,?)",
      [question_id, form_id, question_text, question_type]
    );

    //insert options into the options table if any are provided
    if (options.length > 0) {
      for (const option of options) {
        const { option_text, is_correct } = option;
        await connectionPool.query(
          "insert into options(question_id,option_text,is_correct) values(?,?,?)",
          [question_id, option_text, is_correct ? 1 : 0]
        );
      }
    }

    return new Response(
      { status: 200 },
      JSON.stringify({
        message: "question and options added successfully",
        question_id,
      })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "database insertation error" }),
      { status: 500 }
    );
  }
}
