# Cloudflare Image Resizing: Verification of rgba support for trim.border.color

## Task
Verify if the `color` property in image trim options (`trim.border.color`) supports `rgba` values.

## Context
The type definition in `cloudflare-env.d.ts` contains a TODO:
```typescript
trim?: "border" | {
    // ...
    border?: boolean | {
        color?: string; // rgb or hex representation of the color you wish to trim (todo: verify the rgba bit)
        // ...
    };
};
```

## Verification
According to the [Cloudflare Images documentation on Transforming via Workers](https://developers.cloudflare.com/images/transform-images/transform-via-workers/#trim), the `trim.border.color` property supports any CSS color using CSS4 modern syntax:

> **trim.border.color**
>
> The border color to trim. Accepts any CSS color using CSS4 modern syntax, such as `rgb(255 255 0)`. If omitted, the color is detected automatically.

While the `trim` section example uses `rgb`, the documentation for the `background` property (which shares the same underlying engine) explicitly lists `rgba` as supported:

> **background**
>
> Background color to add underneath the image. ... Accepts any CSS color using CSS4 modern syntax, such as `rgb(255 255 0)` and `rgba(255 255 0 100)`.

Given that `trim.border.color` also states it accepts "any CSS color using CSS4 modern syntax", it is confirmed that `rgba` values are supported.

## Conclusion
The `color` property in `trim.border` supports `rgba` values. The type definition `string` is correct and sufficient to hold these values.
