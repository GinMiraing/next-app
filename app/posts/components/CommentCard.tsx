"use client";

import { Fancybox } from "@fancyapps/ui";
import { useEffect } from "react";

export const CommentCard = () => {
  useEffect(() => {
    Fancybox.bind("[data-fancybox]", {
      groupAll: true,
      Thumbs: false,
      Carousel: {
        transition: "slide",
      },
      Images: {
        zoom: false,
      },
      showClass: "f-fadeSlowIn",
      hideClass: "f-fadeSlowOut",
      wheel: "slide",
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"],
        },
      },
    });

    return () => {
      Fancybox.unbind("[data-fancybox]");
      Fancybox.close();
    };
  }, []);
  return <div>CommentCard</div>;
};

export default CommentCard;
