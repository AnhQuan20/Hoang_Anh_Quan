"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface IResponse {
  currency: string;
  date: string;
  price: number;
}

interface IData {
  label: string;
  value: number;
}

interface IForm {
  INPUT: string;
  INPUT_CURRENCY: string;
  OUTPUT: string;
}

export default function Home() {
  const [data, setData] = useState<IData[]>();

  const formSchema: any = yup.object().shape({
    INPUT: yup
      .number()
      .required("This field is required")
      .typeError("Must be a number")
      .nullable()
      .transform((value) => (value === "" ? undefined : value)),
    INPUT_CURRENCY: yup.string().required("This field is required"),
    OUTPUT: yup.string(),
  });

  const form = useForm<IForm>({
    mode: "onTouched",
    resolver: yupResolver<any>(formSchema),
    defaultValues: {
      INPUT: undefined,
      INPUT_CURRENCY: "",
      OUTPUT: "",
    },
  });
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = form;

  useEffect(() => {
    fetchDataCbo();
  }, []);

  const fetchDataCbo = async () => {
    const response = await axios.get(
      "https://interview.switcheo.com/prices.json"
    );
    if (response && response.data) {
      let dataTemp = response.data.map((item: IResponse) => {
        return {
          label: item.currency,
          value: item.price,
        };
      });
      setData(dataTemp);
    }
  };

  const renderMenuItem = useCallback(() => {
    return (
      data &&
      data.length != 0 &&
      data.map((item: IData, index) => (
        <MenuItem key={index} value={item.value}>
          {item.label}
        </MenuItem>
      ))
    );
  }, [data]);

  const onSubmit = (data: IForm) => {
    const result = parseFloat(data.INPUT) * parseFloat(data.INPUT_CURRENCY);
    setValue("OUTPUT", result.toString());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Image alt="Picture of the author" src="/105852.jpg" fill={true} />
      <main
        className="flex h-[500px] w-full max-w-xl flex-col items-center py-16 px-16 bg-white dark:bg-black sm:items-start rounded-2xl shadow-lg z-10"
        style={{ backgroundColor: `rgba(255, 255, 255, 0.5)` }}
      >
        <div className="w-full flex justify-center items-center">
          <span className="text-2xl">Swap</span>
        </div>
        <div className="w-full flex justify-center items-center">
          <Controller
            control={control}
            name="INPUT"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                value={value}
                label={"Amount to send"}
                variant="outlined"
                margin="dense"
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
                onChange={(e) => {
                  onChange(e.target.value);
                  if (errors.INPUT) clearErrors("INPUT");
                }}
                error={errors.INPUT ? true : false}
                style={{
                  margin: "6px",
                  width: "70%",
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="INPUT_CURRENCY"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Select
                value={value}
                label="to"
                displayEmpty
                error={errors.INPUT_CURRENCY ? true : false}
                onChange={(event: SelectChangeEvent) => {
                  setValue("INPUT_CURRENCY", event.target.value);
                  if (errors.INPUT_CURRENCY) clearErrors("INPUT_CURRENCY");
                }}
                style={{
                  width: "30%",
                  margin: "6px",
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {renderMenuItem()}
              </Select>
            )}
          />
        </div>
        {(errors.INPUT || errors.INPUT_CURRENCY) && (
          <div className="w-full h-[22px] flex justify-start items-center ">
            <span className="w-[70%] text-[12px] mx-1.5 text-red-700">
              {errors?.INPUT?.message}
            </span>
            <span className="w-[30%] text-[12px] mx-1.5 text-red-700">
              {errors?.INPUT_CURRENCY?.message}
            </span>
          </div>
        )}

        <div className="w-full flex justify-center items-center">
          <Controller
            control={control}
            name="OUTPUT"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                value={value}
                label={"Amount to receive"}
                variant="outlined"
                margin="dense"
                fullWidth
                onChange={(e) => {
                  onChange(e.target.value);
                  if (errors.OUTPUT) clearErrors("OUTPUT");
                }}
                style={{
                  margin: "14px 6px",
                  width: "100%",
                }}
                disabled={true}
              />
            )}
          />
        </div>
        <div className="w-full flex justify-center items-center mt-6 gap-4">
          <Button variant="outlined" onClick={handleSubmit(onSubmit)}>
            Exchange
          </Button>
          <Button variant="outlined" onClick={() => reset()}>
            Refresh
          </Button>
        </div>
      </main>
    </div>
  );
}
