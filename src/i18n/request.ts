import { getRequestConfig } from 'next-intl/server';

const staticLocales = ['en', 'zh'];

export default getRequestConfig(async ({ locale }) => {
    if (!locale || !staticLocales.includes(locale)) {
        locale = 'en';
    }

    return {
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});

export { staticLocales };
