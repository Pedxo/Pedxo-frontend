import Button from "./Button";

function PayrollList({ info }) {
  const { name, image, country, position, pay, status } = info;

  return (
    <>
      <li className="hidden lg:flex items-center capitalize text-sm text-center justify-between p-4 rounded-md border">
        <div className="flex items-center  w-48 gap-3">
          <figure
            className="w-10 h-10 rounded-full bg-white border"
            style={{
              backgroundImage: `url(${image})`,
              backgroundPosition: "center",
              backgroundSize: "center",
            }}
          ></figure>
          <span className="truncate">{name}</span>
        </div>
        <p className="w-48 truncate">{country}</p>
        <p className="w-48 truncate">{position}</p>
        <p className="w-32 truncate">${pay}</p>
        <p
          className={`w-32 ${
            status === "paid" ? "text-brandGreen" : "text-brandRed"
          } `}
        >
          {status}
        </p>
        <div className="flex-shrink-0 flex items-center justify-center w-32">
          {status === "paid" ? (
            <Button size="tiny" type="primary">
              {" "}
              View Receipt
            </Button>
          ) : (
            <Button size="tiny" type="danger">
              Pay
            </Button>
          )}
        </div>
      </li>
      <li className="flex flex-col gap-5 lg:hidden items-center capitalize text-sm text-center justify-between p-4  rounded-md border">
        <div className="flex w-full justify-between items-start">
          <div className="flex items-start gap-3">
            <figure
              className="w-10 flex-shrink-0 h-10 rounded-full bg-white border"
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: "center",
                backgroundSize: "center",
              }}
            ></figure>
            <div className="w-full space-y-1">
              <span className="truncate w-24 ">{name}</span>
              <p className="text-xs truncate w-24 text-black/50">{country}</p>
            </div>
          </div>
            <p
              className={`p-1 rounded-sm text-xs ${
                status === "paid"
                  ? "bg-green-100 text-brandGreen"
                  : "bg-red-100 text-brandRed"
              } `}
            >
              {status}
            </p>

          <p className="text-sm ">${pay}</p>
        </div>
        <div className="flex w-full justify-between items-center">
          <p className="font-medium">{position}</p>
            {status === "paid" ? (
              <Button size="tiny" type="primary">
                View Receipt
              </Button>
            ) : (
              <Button size="tiny" type="danger">
                Pay
              </Button>
            )}
        </div>
      </li>
    </>
  );
}

export default PayrollList;
