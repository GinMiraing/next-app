"use server";

import { NextResponse } from "next/server";

export const BadRequest = (message?: string) => {
  return NextResponse.json(
    { error: message || "Bad Request" },
    { status: 400 },
  );
};

export const Forbidden = (message?: string) => {
  return NextResponse.json({ error: message || "Forbidden" }, { status: 403 });
};

export const NotFound = (message?: string) => {
  return NextResponse.json({ error: message || "Not Found" }, { status: 404 });
};

export const InternalError = (message?: string) => {
  return NextResponse.json(
    { error: message || "Internal Server Error" },
    { status: 500 },
  );
};
