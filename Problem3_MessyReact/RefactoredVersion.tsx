interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; //blockchain is missing so I add it
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  // formatted is not necessary so I remove it
  //formatted: string;
}

//BoxProps is missing so I add it
interface BoxProps {}

// Apply Strategy pattern for getPriority function to make it clean and easy to understand
const osmosisPriority = () => {
  return 100;
};
const ethereumPriority = () => {
  return 50;
};
const arbitrumPriority = () => {
  return 30;
};
const zilliqaPriority = () => {
  return 20;
};
const neoPriority = () => {
  return 20;
};
const defaultPriority = () => {
  return 100;
};

const getPriority = (blockchain: string): number => {
  return getPriorityStrategies[blockchain];
};

const getPriorityStrategies = {
  osmosis: osmosisPriority,
  ethereum: ethereumPriority,
  arbitrum: arbitrumPriority,
  zilliqa: zilliqaPriority,
  neo: neoPriority,
  default: defaultPriority,
};
// Apply Strategy pattern for getPriority function to make it clean and easy to understand

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // lhsPriority is not defined. I assume this is a mistake so I replace variable balancePriority
        if (balancePriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      })
      .map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={index}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.amount.toFixed()} // I replaced balance.formatted because formattedBalances is not available (Please see below comments)
          />
        );
      });
  }, [balances, prices]);

  // I think formattedBalances is not necessary (1 more .map() for 1 extra field. In this case, it's definitely not worth it)
  //   const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  //     return {
  //       ...balance,
  //       formatted: balance.amount.toFixed(),
  //     };
  //   });

  // I managed to combined rows and sortedBalances
  //   const rows = sortedBalances.map(
  //     (balance: FormattedWalletBalance, index: number) => {
  //       const usdValue = prices[balance.currency] * balance.amount;
  //       return (
  //         <WalletRow
  //           className={classes.row}
  //           key={index}
  //           amount={balance.amount}
  //           usdValue={usdValue}
  //           formattedAmount={balance.amount.toFixed()}
  //         />
  //       );
  //     }
  //   );

  return <div {...rest}>{sortedBalances}</div>; //I managed to to combined rows and sortedBalances
};
