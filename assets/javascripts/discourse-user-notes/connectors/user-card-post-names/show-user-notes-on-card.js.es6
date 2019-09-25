import { showUserNotes } from "discourse/plugins/discourse-user-notes/discourse-user-notes/lib/user-notes";
import { getOwner } from "discourse-common/lib/get-owner";
import { emojiUrlFor } from "discourse/lib/text";

export default {
  shouldRender(args, component) {
    const { siteSettings, currentUser } = component;
    const { user } = args;
    const count = user.user_notes_count || user.custom_fields.user_notes_count;
    return (
      siteSettings.user_notes_enabled &&
      currentUser &&
      currentUser.staff &&
      count >= 1
    );
  },

  setupComponent(args, component) {
    const { user } = args;
    const count =
      user.get("user_notes_count") ||
      user.get("custom_fields.user_notes_count") ||
      0;
    component.set("userNotesCount", count);
    component.set("emojiEnabled", component.siteSettings.enable_emoji);
    component.set("emojiUrl", emojiUrlFor("pencil"));
    component.set("user", user);
    component.set("userNotesTitle", I18n.t("user_notes.show", { count }));
  },

  actions: {
    showUserNotes() {
      this.parentView.parentView._close();
      const store = getOwner(this).lookup("store:main");
      const user = this.get("args.user");
      showUserNotes(store, user.get("id"), count => {
        if (this.isDestroying || this.isDestroyed) {
          return;
        }

        this.set("userNotesCount", count);
      });
    }
  }
};
