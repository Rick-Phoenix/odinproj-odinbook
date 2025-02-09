import { schemas } from "@nexus/shared-schemas";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HandCoins } from "lucide-react";
import { motion, useSpring, useTransform } from "motion/react";
import { type FC, type MouseEvent, type MouseEventHandler } from "react";
import {
  Autoplay,
  EffectCoverflow,
  Mousewheel,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import InsetScrollArea from "../../../components/custom/inset-scrollarea";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { api, type ListingInputs } from "../../../lib/api-client";
import {
  formatFormErrors,
  singleErrorsAdapter,
} from "../../../utils/form-utils";
import { errorTypeGuard } from "../../../utils/type-guards";

export const Route = createFileRoute("/_app/marketplace/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <InsetScrollArea>
      <section className="flex min-h-svh max-w-full flex-col items-center rounded-xl bg-muted/50">
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Marketplace
        </h2>
        <OffersCarousel />
        <div className="flex h-40 w-full items-center justify-center p-8">
          <CreateListingDialog />
        </div>
        <h2 className="scroll-m-20 border-b p-5 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Browse By Category
        </h2>
        <div className="grid w-full auto-rows-[5rem] grid-cols-2 gap-8 p-8">
          <CategoryCard category={"Technology"} />
          <CategoryCard category={"Videogames"} />
          <CategoryCard category={"Fashion"} />
          <CategoryCard category={"Collectibles"} />
          <CategoryCard category={"Books"} />
          <CategoryCard category={"Motors"} />
        </div>
      </section>
    </InsetScrollArea>
  );
}

const CreateListingDialog = () => {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "Technology",
      pic: undefined,
      price: 0,
      location: "",
      condition: "New",
    },
    validators: {
      onSubmit: schemas.insertListingSchema,
      onSubmitAsync: async ({ value }) => {
        console.log(value);
        try {
          await handleCreateListing.mutateAsync(value);
          return null;
        } catch (error) {
          if (errorTypeGuard(error)) return error.message;
        }
      },
    },
    validatorAdapter: singleErrorsAdapter,
  });

  const handleCreateListing = useMutation({
    mutationKey: ["room", "new"],
    mutationFn: async (value: ListingInputs) => {
      const { pic, ...inputs } = value;
      const file = pic
        ? new File([pic as BlobPart], `listing-${Date.now()}`, {
            type: pic.type,
          })
        : null;
      const res = await api.market.listings.$post({
        form: {
          ...inputs,
          ...(file && { pic: file }),
        },
      });
      const resData = await res.json();
      console.log(resData);
      if ("issues" in resData) {
        throw new Error(resData.issues[0].message);
      }
      return resData;
    },
    onSuccess(data, variables, context) {
      navigate({
        to: "/marketplace/$category/$itemId",
        params: { category: data.category, itemId: data.id },
      });
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-full justify-between text-2xl [&_svg]:size-12">
          Sell An Item <HandCoins />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Room</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Rooms are spaces where you can share your ideas and passions with
          other members of the community.
        </DialogDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <form.Field
                name="title"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>{field.name}</Label>
                      <Input
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        placeholder="Title..."
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.isTouched &&
                        formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="price"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>{field.name}</Label>
                      <Input
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        placeholder="Price..."
                        onChange={(e) =>
                          field.handleChange(e.target.valueAsNumber)
                        }
                        required
                      />
                      {field.state.meta.isTouched &&
                        formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="category"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Category</Label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(e) =>
                          field.handleChange(
                            e as (typeof schemas.marketplaceCategories)[number],
                          )
                        }
                        required
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {schemas.marketplaceCategories.map((cat, i) => (
                            <SelectItem key={i} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.state.meta.isTouched &&
                        formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="condition"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Condition</Label>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={(e) =>
                          field.handleChange(
                            e as (typeof schemas.itemConditions)[number],
                          )
                        }
                        required
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {schemas.itemConditions.map((cond, i) => (
                            <SelectItem key={i} value={cond}>
                              {cond}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.state.meta.isTouched &&
                        formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="pic"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Picture</Label>
                      <Input
                        name={field.name}
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          form.setFieldValue("pic", file);
                        }}
                      />
                      {field.state.meta.isTouched &&
                        formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <div className="grid gap-2">
              <form.Field
                name="description"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Description</Label>
                      <Input
                        name={field.name}
                        type="text"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.isTouched &&
                        formatFormErrors(field.state.meta.errors)}
                    </>
                  );
                }}
              ></form.Field>
            </div>
            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
                state.isTouched,
                state.isSubmitted,
              ]}
              children={([canSubmit, isSubmitting, isTouched, isSubmitted]) => {
                return (
                  <DialogFooter>
                    <Button
                      type="submit"
                      aria-disabled={!canSubmit || !isTouched}
                      disabled={!canSubmit || !isTouched}
                      className="w-full"
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                );
              }}
            />
            <form.Subscribe
              selector={(state) => [state.errorMap]}
              children={([errorMap]) =>
                errorMap.onSubmit ? (
                  <div>
                    <em>{errorMap.onSubmit?.toString()}</em>
                  </div>
                ) : null
              }
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CategoryCard: React.FC<
  React.ComponentProps<"button"> & { category: string }
> = ({ category, children, ...props }) => {
  const cardRotation = 15;
  const cardScale = 1.05;

  const xPcnt = useSpring(0, { bounce: 0 });
  const yPcnt = useSpring(0, { bounce: 0 });
  const scale = useSpring(1, { bounce: 0 });

  const rotateX = useTransform(
    yPcnt,
    [-0.5, 0.5],
    [`-${cardRotation}deg`, `${cardRotation}deg`],
  );
  const rotateY = useTransform(
    xPcnt,
    [-0.5, 0.5],
    [`-${cardRotation}deg`, `${cardRotation}deg`],
  );

  const getMousePosition = (e: MouseEvent) => {
    const { width, height, left, top } =
      e.currentTarget.getBoundingClientRect();
    const currentMouseX = e.clientX - left;
    const currentMouseY = e.clientY - top;

    return {
      currentMouseX,
      currentMouseY,
      containerWidth: width,
      containerHeight: height,
    };
  };

  const handleMouseMove: MouseEventHandler = (e: MouseEvent) => {
    const { currentMouseX, currentMouseY, containerWidth, containerHeight } =
      getMousePosition(e);

    xPcnt.set(currentMouseX / containerWidth - 0.5);
    yPcnt.set(currentMouseY / containerHeight - 0.5);
  };
  const handleMouseEnter: MouseEventHandler = (e: MouseEvent) => {
    scale.set(cardScale);
  };
  const handleMouseLeave: MouseEventHandler = (e: MouseEvent) => {
    scale.set(1);
    xPcnt.set(0);
    yPcnt.set(0);
  };
  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", scale }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex items-center justify-center rounded-xl bg-slate-300"
    >
      <Link
        to="/marketplace/$category"
        params={{ category }}
        className="flex size-full scroll-m-20 items-center justify-center text-xl font-semibold tracking-tight text-primary-foreground"
      >
        {category}
      </Link>
    </motion.button>
  );
};

function OffersCarousel() {
  return (
    <>
      <div className="h-full w-full p-8 [--swiper-pagination-bottom:-5px] [--swiper-pagination-bullet-horizontal-gap:0.5rem] [--swiper-pagination-color:hsl(var(--primary))] [&_.swiper]:pb-8">
        <Swiper
          modules={[Autoplay, EffectCoverflow, Pagination, Mousewheel]}
          mousewheel={{
            invert: false,
          }}
          effect={"coverflow"}
          loop={true}
          breakpoints={{
            320: {
              spaceBetween: 10,
              slidesPerView: 1,
            },
            1024: {
              spaceBetween: 15,
              slidesPerView: 2,
            },
            1536: {
              spaceBetween: 30,
              slidesPerView: 3,
            },
          }}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          centeredSlides={true}
          grabCursor={true}
          coverflowEffect={{
            rotate: 50,
            slideShadows: false,
          }}
        >
          {Array.from({ length: 12 }).map((e, i) => {
            return (
              <SwiperSlide key={i}>
                <PromotionItem
                  price={10000}
                  name="Occaecat velit quis nisi nisi do et. Irure quis tempor fugiat non aliquip. Nisi culpa esse est nostrud veniam dolore duis nisi magna. Consequat est Lorem qui commodo ea elit veniam dolor est ad sit.

Voluptate voluptate do ea eu. Et dolore pariatur esse occaecat aliqua consectetur voluptate et et aliquip sint consectetur. Id magna cillum pariatur Lorem voluptate proident. Id minim magna ipsum id cillum irure. Adipisicing laborum magna labore commodo ullamco adipisicing proident ad enim amet sint non incididunt fugiat. Voluptate ipsum incididunt ut aliqua. Aliqua culpa ea commodo consequat quis et sint fugiat ipsum."
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
}

const PromotionItem: FC<{ price: number; name: string }> = ({
  price,
  name,
}) => {
  return (
    <Link
      to={"/marketplace/$category/$itemId"}
      params={{ category: "foo", itemId: "1" }}
      className="flex flex-col items-center gap-5 rounded-xl border-background bg-muted-foreground/30 p-6 py-8"
    >
      <div className="aspect-square h-full w-full bg-white"></div>
      <h4 className="line-clamp-2 scroll-m-20 text-2xl font-semibold tracking-tight">
        {name}
      </h4>
      <h4 className="max-w-[6ch] text-center text-xl font-semibold leading-7">
        ${price}
      </h4>
    </Link>
  );
};
