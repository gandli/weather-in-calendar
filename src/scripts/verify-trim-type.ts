/// <reference path="../../cloudflare-env.d.ts" />

/**
 * This script verifies that the type definition for RequestInitCfPropertiesImage
 * accepts rgba strings for the trim.border.color property.
 *
 * If this file compiles without errors, the type definition is compatible with rgba.
 */

function verifyTrimType() {
    const imageOptions: RequestInitCfPropertiesImage = {
        trim: {
            border: {
                // Verify that rgba string is accepted
                color: "rgba(255, 0, 0, 0.5)",
                tolerance: 10,
                keep: 5
            }
        }
    };

    const imageOptions2: RequestInitCfPropertiesImage = {
        trim: {
             border: {
                // Verify that standard hex is accepted
                color: "#FF0000",
             }
        }
    };

    // Prevent unused variable warning
    console.log(imageOptions, imageOptions2);
}

verifyTrimType();
