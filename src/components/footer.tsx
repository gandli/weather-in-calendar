"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { Github, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
    {
        name: 'Twitter',
        url: 'https://twitter.com',
        icon: Twitter,
    },
    {
        name: 'GitHub',
        url: 'https://github.com',
        icon: Github,
    },
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com',
        icon: Linkedin,
    }
];
import { useTranslations } from "next-intl";

const socialLinks = [
    {
        name: 'Twitter',
        url: 'https://twitter.com',
        icon: Twitter,
    },
    {
        name: 'GitHub',
        url: 'https://github.com',
        icon: Github,
    },
    {
        name: 'LinkedIn',
        url: 'https://linkedin.com',
        icon: Linkedin,
    }
];

export function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="border-t border-muted/20 bg-background/50 backdrop-blur-xl">
            <div className="container mx-auto px-6 py-12 md:flex md:items-center md:justify-between">
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-muted-foreground">
                        {t('copyright', { year: new Date().getFullYear() })}
                    </p>
                </div>
                <div className="flex justify-center space-x-6 md:order-2">
                    {socialLinks.map((link) => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                            <span className="sr-only">{link.name}</span>
                            <link.icon className="h-6 w-6" aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
