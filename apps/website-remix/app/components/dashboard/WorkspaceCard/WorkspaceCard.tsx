import React from "react";
import { Link, useNavigation, useSubmit } from "@remix-run/react";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@template/ui/components/card";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

interface WorkspaceCardProps {
  item: components["schemas"]["WorkspaceEntity"];
}

export default function WorkspaceCard({ item }: WorkspaceCardProps) {
  const navigation = useNavigation();
  const submit = useSubmit();

  const nextFavorite = (!item.isFavorite).toString();

  const onClickFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("workspaceId", item.id.toString());
    formData.append("isFavorite", nextFavorite);
    submit(formData, {
      method: "PATCH",
      replace: true,
    });
  };

  const isSubmittingForm = navigation.state === "submitting";

  return (
    <Link to={PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ID(item.id)} viewTransition>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>{item.title}</div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={isSubmittingForm}
              aria-disabled={isSubmittingForm}
              onClick={onClickFavorite}
            >
              {item.isFavorite ? (
                <Icons.Star className="fill-current text-yellow-300" />
              ) : (
                <Icons.Star className="text-yellow-300" />
              )}
            </Button>
          </CardTitle>
          {item.description ? (
            <CardDescription>{item.description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </Link>
  );
}
