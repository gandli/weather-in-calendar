import { NextResponse } from 'next/server';

export function proxy() {
    return NextResponse.next();
}

// 匹配一个不常访问的路由，或者保持为空，以尽量减少运行时开销
export const config = {
    matcher: ['/_dummy_middleware_path_'],
};
