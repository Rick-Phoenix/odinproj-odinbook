--//SECTION[epic=Database Triggers] - Triggers
--//ANCHOR - Delete Chat
CREATE OR REPLACE FUNCTION check_and_delete_chat () RETURNS TRIGGER AS $$
DECLARE
  other_deleted BOOLEAN;
BEGIN
  SELECT "isDeleted" INTO other_deleted
  FROM "chatInstances"
  WHERE "chatId" = NEW."chatId" AND "ownerId" = NEW."contactId";

  IF other_deleted THEN
    DELETE FROM "chatInstances" WHERE "chatId" = NEW."chatId";
    DELETE FROM "chats" WHERE "id" = NEW."chatId";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_soft_delete_trigger
AFTER
UPDATE OF "isDeleted" ON "chatInstances" FOR EACH ROW WHEN (NEW."isDeleted" IS TRUE)
EXECUTE FUNCTION check_and_delete_chat ();

--ANCHOR - Refresh Chats
CREATE OR REPLACE FUNCTION refresh_chats () RETURNS TRIGGER AS $$ 
BEGIN
  UPDATE "chatInstances"
  SET 
    "isDeleted" = FALSE,
    "firstMessageId" = CASE 
                      WHEN "isDeleted" = TRUE THEN NEW."id" 
                      ELSE "firstMessageId" 
                      END,
    "lastRead" = CASE 
                  WHEN "ownerId" = NEW."senderId" THEN NOW()
                  ELSE "lastRead"
                 END
  WHERE "chatId" = NEW."chatId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_chats
AFTER INSERT ON messages FOR EACH ROW
EXECUTE FUNCTION refresh_chats ()
--ANCHOR - Set Chat Id
SET
  Chat Id
CREATE TRIGGER before_chat_instance_insert BEFORE INSERT ON "chatInstances" FOR EACH ROW
EXECUTE FUNCTION set_chat_id ();

CREATE OR REPLACE FUNCTION set_chat_id () RETURNS TRIGGER AS $$
DECLARE
  existing_chat_id INT;
  lock_key BIGINT;
BEGIN
  lock_key := hashtext(
    LEAST(NEW."ownerId"::TEXT, NEW."contactId"::TEXT) || 
    GREATEST(NEW."ownerId"::TEXT, NEW."contactId"::TEXT)
  );

  PERFORM pg_advisory_xact_lock(lock_key);

  SELECT "chatId" INTO existing_chat_id
  FROM "chatInstances"
  WHERE "ownerId" = NEW."ownerId" AND "contactId" = NEW."contactId";

  IF existing_chat_id IS NOT NULL THEN
    RETURN NULL; 
  END IF;

  SELECT "chatId" INTO existing_chat_id
  FROM "chatInstances"
  WHERE "ownerId" = NEW."contactId" AND "contactId" = NEW."ownerId";

  IF existing_chat_id IS NOT NULL THEN
    NEW."chatId" = existing_chat_id;
  ELSE
    INSERT INTO "chats" DEFAULT VALUES RETURNING "id" INTO NEW."chatId";
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--//ANCHOR - Create Reciprocal Entry
CREATE TRIGGER after_chat_instance_insert
AFTER INSERT ON "chatInstances" FOR EACH ROW
EXECUTE FUNCTION insert_reciprocal_entry ();

CREATE OR REPLACE FUNCTION insert_reciprocal_entry () RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "chatInstances" ("chatId", "ownerId", "contactId")
  SELECT NEW."chatId", NEW."contactId", NEW."ownerId"
  WHERE NOT EXISTS (
    SELECT 1
    FROM "chatInstances"
    WHERE "chatId" = NEW."chatId"
      AND "ownerId" = NEW."contactId"
      AND "contactId" = NEW."ownerId"
  );

  RETURN NULL; 
END;
$$ LANGUAGE plpgsql;

--ANCHOR - Delete User Content
CREATE TRIGGER user_content_delete BEFORE DELETE ON users FOR EACH ROW
EXECUTE FUNCTION delete_user_content ();

CREATE OR REPLACE FUNCTION delete_user_content () RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET "authorId" = 'deleted' WHERE "authorId" = OLD.id;
  UPDATE comments SET "userId" = 'deleted', "isDeleted" = TRUE WHERE "userId" = OLD.id;
  UPDATE rooms SET "creatorId" = 'deleted' WHERE "creatorId" = OLD.id;
  UPDATE "chatInstances" SET "contactId" = 'deleted' WHERE "contactId" = OLD.id;
  UPDATE messages SET "senderId" = 'deleted' WHERE "senderId" = OLD.id;
  UPDATE messages SET "receiverId" = 'deleted' WHERE "receiverId" = OLD.id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

--ANCHOR - Update last read message after insert
CREATE TRIGGER update_chat_after_message
AFTER INSERT ON messages FOR EACH ROW
EXECUTE FUNCTION update_last_read ();

CREATE OR REPLACE FUNCTION update_last_read () RETURNS TRIGGER AS $$
BEGIN
  UPDATE "chatInstances" SET "lastRead" = NOW() 
  WHERE "chatInstances"."chatId" = NEW."chatId" 
  AND "chatInstances"."ownerId" = NEW."senderId"
END;
$$ LANGUAGE plpgsql;

-- ANCHOR Decrease post likes count 
CREATE OR REPLACE FUNCTION public.decrease_likes_count () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  UPDATE posts
  SET "likesCount" = "likesCount" - 1
  WHERE id = OLD."postId";

  RETURN OLD;
END;
$function$;

CREATE TRIGGER decrease_likes_count
AFTER DELETE ON public."postLikes" FOR EACH ROW
EXECUTE FUNCTION decrease_likes_count ();

-- ANCHOR - Increase post likes count 
CREATE OR REPLACE FUNCTION public.increase_likes_count () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  UPDATE posts
  SET "likesCount" = "likesCount" + 1
  WHERE id = NEW."postId";

  RETURN NEW;
END;
$function$;

-- ANCHOR - Increase comment likes
CREATE OR REPLACE FUNCTION public.increase_comment_like_count () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  UPDATE comments
  SET "likesCount" = "likesCount" + 1
  WHERE id = NEW."commentId";
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER increase_comment_like_count
AFTER INSERT ON public."commentLikes" FOR EACH ROW
EXECUTE FUNCTION increase_comment_like_count ();

-- ANCHOR - Decrease comment likes
CREATE OR REPLACE FUNCTION public.decrease_comment_like_count () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  UPDATE comments
  SET "likesCount" = "likesCount" - 1
  WHERE id = OLD."commentId";

  RETURN OLD;
END;
$function$;

CREATE TRIGGER decrease_comment_like_count
AFTER DELETE ON public."commentLikes" FOR EACH ROW
EXECUTE FUNCTION decrease_comment_like_count ();

-- ANCHOR - Increase subs count
CREATE OR REPLACE FUNCTION public.increase_subs_count () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  UPDATE rooms
  SET "subsCount" = "subsCount" + 1
  WHERE name = NEW."room";
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER increase_subs_count
AFTER INSERT ON public.subs FOR EACH ROW
EXECUTE FUNCTION increase_subs_count ();

-- ANCHOR - Decrease subs count
CREATE OR REPLACE FUNCTION public.decrease_subs_count () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  UPDATE rooms
  SET "subsCount" = "subsCount" - 1
  WHERE name = OLD."room";
  
  RETURN OLD;
END;
$function$;

CREATE TRIGGER decrease_subs_count
AFTER DELETE ON public.subs FOR EACH ROW
EXECUTE FUNCTION decrease_subs_count ();

-- ANCHOR - Auto sub own room
CREATE OR REPLACE FUNCTION public.auto_sub_own_room () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  INSERT INTO subs ("userId", "room")
  VALUES (NEW."creatorId", NEW."name");
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER auto_sub_on_room_creation
AFTER INSERT ON public.rooms FOR EACH ROW
EXECUTE FUNCTION auto_sub_own_room ();

-- ANCHOR - Auto like own comment
CREATE OR REPLACE FUNCTION public.auto_like_own_comment () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  INSERT INTO "commentLikes" ("userId", "commentId")
  VALUES (NEW."userId", NEW."id");
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER auto_like_on_comment_creation
AFTER INSERT ON public.comments FOR EACH ROW
EXECUTE FUNCTION auto_like_own_comment ();

-- ANCHOR - Auto like own post
CREATE OR REPLACE FUNCTION public.auto_like_own_post () RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
  INSERT INTO "postLikes" ("userId", "postId")
  VALUES (NEW."authorId", NEW."id");
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER auto_like_on_post_creation
AFTER INSERT ON public.posts FOR EACH ROW
EXECUTE FUNCTION auto_like_own_post ();

--//!SECTION
