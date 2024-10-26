export function getTotalBalance(user) {
  const balance = user.balance ?? 0;
  let owedFromBalanceTotal = 0;
  if (user.owedFrom) {
    user.owedFrom?.forEach((el) => {
      owedFromBalanceTotal += el.balance ?? 0;
    });
  }
  return balance + owedFromBalanceTotal;
}

export function getActualBalance(user) {
  const balance = user.balance ?? 0;
  return balance;
}

export function updatedUserWithNewBalance(user, total, isDeposit) {
  const totalBalance = isDeposit
    ? Number(getActualBalance(user)) + Number(total)
    : Number(getActualBalance(user)) - Number(total);
  const updatedUser = {
    ...user,
    balance: totalBalance,
  };
  return updatedUser;
}

export function getOwed(user1, user2, amount, isOwedTo) {
  let results = [];
  if (isOwedTo) {
    let newOwed = [
      {
        balance: Number(amount.trim()) - Number(getActualBalance(user1)),
        name: user2.name,
      },
    ];
    const updatedUserIndex = user1.owedTo?.findIndex(
      (el) => el.name === user2.name
    );
    const updatedUser = user1.owedTo?.[updatedUserIndex];
    if (updatedUser) {
      updatedUser = {
        ...updatedUser,
        balance: (newOwed.balance ?? 0) + (el.balance ?? 0),
      };
      user1.owedTo[updatedUserIndex] = updatedUser;
    }
    if (user1?.owedTo) results = [...user1?.owedTo];
    results = [...results, ...newOwed];
  } else {
    let newOwed = [
      {
        balance: Number(amount.trim()) - Number(getActualBalance(user1)),
        name: user1.name,
      },
    ];
    const updatedUserIndex = user2.owedFrom?.findIndex(
      (el) => el.name === user1.name
    );
    const updatedUser = user2.owedFrom?.[updatedUserIndex];
    if (updatedUser) {
      updatedUser = {
        ...updatedUser,
        balance: (newOwed.balance ?? 0) + (el.balance ?? 0),
      };
      user2.owedFrom[updatedUserIndex] = updatedUser;
    }
    if (user2?.owedFrom) results = [...user2?.owedFrom];
    results = [...results, ...newOwed];
  }

  return results;
}

export function sum(a, b) {
  return a + b;
}