"use server";

import { NextResponse } from "next/server";

export const BadRequest = (message?: string) => {
  return NextResponse.json({ error: message || "参数错误" }, { status: 400 });
};

export const Forbidden = (message?: string) => {
  return NextResponse.json({ error: message || "无权限" }, { status: 403 });
};

export const NotFound = (message?: string) => {
  return NextResponse.json({ error: message || "未找到" }, { status: 404 });
};

export const InternalError = (message?: string) => {
  return NextResponse.json({ error: message || "服务器错误" }, { status: 500 });
};
