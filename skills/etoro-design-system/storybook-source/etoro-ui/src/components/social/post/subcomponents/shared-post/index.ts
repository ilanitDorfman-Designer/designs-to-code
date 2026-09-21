import { SharedPostAttachment } from './shared-post-attachment';
import { SharedPostBody } from './shared-post-body';
import { SharedPostDeleted } from './shared-post-deleted';
import { SharedPostFrame } from './shared-post-frame';
import { SharedPostHeader } from './shared-post-header';

export { useIsSharedAttachment } from './shared-post-attachment';
export { SHARED_POST_BORDER_WIDTH } from './shared-post-frame';

/**
 * EtPost.SharedPost — compound component for nested shared posts.
 *
 * - `.Header / .Body / .Attachment` — sub-elements of the active-share frame,
 *   used as children of `<EtPost.SharedPost>`.
 * - `.Deleted` — leaf placeholder rendered directly under `<EtPost>` (NOT a
 *   child of `<EtPost.SharedPost>`) when the original of the shared post has
 *   been deleted. Mutually exclusive with the active-share frame; the dot is
 *   purely API grouping so both states live under the same `SharedPost.*` namespace.
 *
 * @example Active share
 * ```tsx
 * <EtPost.SharedPost>
 *   <EtPost.SharedPost.Header displayName="Author" avatar="..." timestamp="2h" />
 *   <EtPost.SharedPost.Body text="Original content..." />
 *   <EtPost.SharedPost.Attachment>
 *     <EtPost.Image source="..." />
 *   </EtPost.SharedPost.Attachment>
 * </EtPost.SharedPost>
 * ```
 *
 * @example Deleted share
 * ```tsx
 * <EtPost.SharedPost.Deleted text="The shared post was deleted" />
 * ```
 */
export const SharedPost = Object.assign(SharedPostFrame, {
  Header: SharedPostHeader,
  Body: SharedPostBody,
  Attachment: SharedPostAttachment,
  Deleted: SharedPostDeleted,
});
