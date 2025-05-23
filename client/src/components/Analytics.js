import { Progress } from 'antd';
import React from 'react'

const Analytics = ({allTransaction}) => {

    //category
    const categories = [
        "salary",
        "tip",
        "project",
        "food",
        "movie",
        "bills",
        "medical",
        "fee",
        "tax",
    ];

    //total transactions
    const totalTransaction= allTransaction.length;
    const totalIncomeTransaction= allTransaction.filter(transaction => transaction.type === 'income');
    const totalExpenseTransaction= allTransaction.filter(transaction => transaction.type === 'expense');
    const totalIncomePerecent= (totalIncomeTransaction.length/totalTransaction) * 100;
    const totalExpensePerecent= (totalExpenseTransaction.length/totalTransaction) * 100;

    //total turnover
    const totalTurnover = allTransaction.reduce(
        (acc,transaction) => acc + transaction.amount,
        0
    );
    const totalIncomeTurnover = allTransaction.filter(
        (transaction) => transaction.type === "income")
        .reduce((acc,transaction) => acc + transaction.amount, 0);

        const totalExpenseTurnover = allTransaction
        .filter((transaction) => transaction.type === 'expense')
        .reduce((acc,transaction) => acc + transaction.amount, 0);

        const totalIncomeTurnoverPerecent = 
        (totalIncomeTurnover/totalTurnover) * 100;
        const totalExpenseTurnoverPercent = 
        (totalExpenseTurnover/totalTurnover) * 100;

  return (
    <>
        <div className="row m-3">
            <div className='col-md-4'>
                <div className='card'>
                    <div className='card-header'>
                        Total Transactions: {totalTransaction}
                    </div>
                    <div className='card-body'>
                        <h5 className='text-success'>Income : {totalIncomeTransaction.length}</h5>
                        <h5 className='text-danger'>Expense: {totalExpenseTransaction.length}</h5>
                        <div>
                            <Progress type="circle" strokeColor={"green"} className='mx-2'
                            percent={totalIncomePerecent.toFixed(0)}
                            />
                            <Progress type="circle" strokeColor={"red"} className='mx-2'
                            percent={totalExpensePerecent.toFixed(0)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-4'>
                <div className='card'>
                    <div className='card-header'>
                        Total Transactions: {totalTurnover}
                    </div>
                    <div className='card-body'>
                        <h5 className='text-success'>Income : {totalIncomeTurnover}</h5>
                        <h5 className='text-danger'>Expense: {totalExpenseTurnover}</h5>
                        <div>
                            <Progress type="circle" strokeColor={"green"} className='mx-2'
                            percent={totalIncomeTurnoverPerecent.toFixed(0)}
                            />
                            <Progress type="circle" strokeColor={"red"} className='mx-2'
                            percent={totalExpenseTurnoverPercent.toFixed(0)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='row m-3'>
            <div className='col-md-4'>
                <h4>
                    Category-wise Income
                </h4>
                {
                    categories.map(category => {
                        const amount = allTransaction.filter(transaction => transaction.type === 'income' && transaction.category === category).reduce((acc,transaction) => acc + transaction.amount,0);
                        return (
                            amount > 0  && (
                            <div className='card'>
                                <div className='card-body'>
                                    <h5>{category}</h5>
                                    <Progress
                                    percent={((amount/totalIncomeTurnover) * 100).toFixed(0)} />
                                </div>
                            </div>
                        )
                    );
                    })
                }
            </div>
            <div className='col-md-4'>
                <h4>
                    Category-wise Expense
                </h4>
                {
                    categories.map(category => {
                        const amount = allTransaction.filter(transaction => transaction.type === 'expense' && transaction.category === category).reduce((acc,transaction) => acc + transaction.amount,0);
                        return (
                            amount > 0  && (
                            <div className='card'>
                                <div className='card-body'>
                                    <h5>{category}</h5>
                                    <Progress
                                    percent={((amount/totalExpenseTurnover) * 100).toFixed(0)} />
                                </div>
                            </div>
                        )
                    );
                    })
                }
            </div>
        </div>
    </>
  )
}

export default Analytics

