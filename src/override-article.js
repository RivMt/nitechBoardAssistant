/**
 * @file Override methods in article window
 */

/**
 * Override resCheckRead method
 * This method close previous window and mark article as read if article window has been correctly loaded. And return
 * void.
 * However, this extension handle mark as read function, so disable this method for forward stability.
 */
function resCheckRead() {}