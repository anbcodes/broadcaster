# Hello!

Welcome to the documentation!

The docs are split by interface (user, markdown, or json). Hopefully most stuff is in here.

## High Level Overview

The Broadcaster is mainly an app to send notes to yourself, that is it's primary purpose. But it can also be used to share notes with others.

By default all posts are private ("viewable to" is "just you"). If you want to change that you can specify users that will see your post using @username,
or groups that will see your post using #group.

A group is a collection of users. One user owns the group and can add and remove members, but anyone who knows the name can share a post to it.

> Note: each group name has to be globally unique. So if I created a group #photos, you couldn't create a group #photos; instead you would have to call it something like #andrew_photos.

## Goals

The Broadcaster tries to be fast, flexible, and reliable. It supports many different modes of accessing it (there's a website, a cli, a text api, and a json api).
The goal is to be able to use it from anywhere, at any time and never have to wait.
