import { BLOG_PROFILE_DIR } from "@constants/blog.dir"

import { readFile } from "fs/promises"

import { BlogErrorAdditionalInfo, BlogFileExtractionError } from "@core/error"

import { definePlugins } from "@core/loader/util"
import { bundlePost } from "@core/loader/post"

import { remarkImageSizeByAlt } from "@lib/remark"
import remarkGfm from "remark-gfm"
import rehypePrism from "rehype-prism-plus"

/**
 * - you can set custom `remark-rehype` plugin for profile page
 * - check param of {@link definePlugins}
 * @returns profile source extraction at `{blog_dir}/profile/description.mdx`
 */
const getProfileSource = async () => {
    try {
        const profileContent = await readFile(BLOG_PROFILE_DIR, "utf-8")
        if (!profileContent)
            throw new BlogFileExtractionError({
                errorNameDescription: "post file extraction error occured",
                readingFileFormat: ".mdx",
                readingFileLocation: BLOG_PROFILE_DIR,
                readingFileName: "profile.mdx",
            })

        return await (
            await bundlePost({
                postSource: profileContent,
                customPlugin: definePlugins({
                    // plugins using on profile page
                    rehypePlugins: [rehypePrism],
                    remarkPlugins: [remarkImageSizeByAlt, remarkGfm],
                }),
            })
        ).bundledResult.code
    } catch (err) {
        throw new BlogErrorAdditionalInfo({
            passedError: err,
            errorNameDescription: "profile file reading error",
            message: "",
            customeErrorMessage: `your profile file at:\n\n   ${BLOG_PROFILE_DIR}`,
        })
    }
}

export { getProfileSource }
