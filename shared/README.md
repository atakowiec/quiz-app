# Shared directory

This directory contains files with shared types between the client and the server.

For example when server sends some json data to the client, the client needs to know the structure of the data. This is where the shared directory comes in.

## Convention

There is no strict convention for the shared directory. However, I recommend to:
- store related types in single file (e.g. `user.ts`, `post.ts`, `comment.ts`)
- name files like this `user.d.ts`, `post.d.ts`, `comment.d.ts` etc.
- types that are used only in data transfer should have `Packet` suffix, e.g. `UserPacket`, `GamePacket`
- types that are used in both backend and frontend but are not used for data transfer should have pretty clear name, e.g. `User`, `Post`, `Comment`
