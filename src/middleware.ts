import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    return NextResponse.next();
}

// 匹配一个不常访问的路由，或者保持为空，以尽量减少运行时开销
export const config = {
    matcher: ['/_dummy_middleware_path_'],
};
