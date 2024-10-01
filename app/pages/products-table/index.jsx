"use client"

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {acceptFileTypes} from "@/types/types";
import React, {useEffect, useState} from "react";
import Papa from 'papaparse'
import readXlsxFile from 'read-excel-file'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const ProductsTable = () => {
    const [file, setFile] = useState([[]])
    const [totalQtys, setTotalQtys]  = useState(0)
    const [totalValues, setTotalValues]  = useState(0)

    useEffect(() => {
        totals()
    }, [file]);

    const totals = () => (
      Array.isArray(file) && file.slice(2,file.length).map((el) => (
        el.map((e, index) => (
           index === 5 ? setTotalValues(prevState => Number(prevState) + Number(e)) : null,
           index === 4 ? setTotalQtys(prevState => Number(prevState) + Number(e)) : null
        ))
      ))
    )
    const uploadFileHandler = () => {
        setTotalQtys(0)
        setTotalValues(0)
        if (event.target.files?.[0] && event.target.files?.[0].type === 'application/vnd.ms-excel') {
            Papa.parse(event.target.files?.[0], {
                complete: function(results) {
                    setFile(results.data)
                }
            });
        } else if(event.target.files?.[0] && event.target.files?.[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            readXlsxFile(event.target.files?.[0]).then((rows) => {
                setFile(rows)
            })
        }
    }

    return (
       <section>
           <input
               type={'file'}
               id={'file'}
               accept={acceptFileTypes}
               onChange={uploadFileHandler}
               className={'m-2'}/>
           <div className={'flex flex-row justify-evenly gap-4 m-3'}>
               <Card x-chunk="dashboard-01-chunk-0">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-sm font-medium">
                           Total value
                       </CardTitle>
                   </CardHeader>
                   <CardContent>
                       <div className="text-2xl font-bold">{totalValues}</div>
                   </CardContent>
               </Card>
               <Card x-chunk="dashboard-01-chunk-0">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-sm font-medium">
                           Total Qty
                       </CardTitle>
                   </CardHeader>
                   <CardContent>
                       <div className="text-2xl font-bold">{totalQtys}</div>
                   </CardContent>
               </Card>
               <Card x-chunk="dashboard-01-chunk-0">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                       <CardTitle className="text-sm font-medium">
                           Average price
                       </CardTitle>
                   </CardHeader>
                   <CardContent className="text-2xl font-bold">
                       {totalQtys && totalValues && <div>{(totalValues / totalQtys).toFixed(2)}</div>}
                   </CardContent>
               </Card>
           </div>
           <Table>
               <TableCaption>A list of products</TableCaption>
               <TableHeader>
                   <TableRow>
                       {(Array.isArray(file[0])) && file[0].map((el, index) => (
                           <TableHead className="w-[100px]" key={index}>{el}</TableHead>
                       ))}
                   </TableRow>
               </TableHeader>
               <TableBody>
                   {Array.isArray(file) && file.slice(1,file.length).map((el, index) => (
                        <TableRow key={index}>
                           {el.map((e, index) => (
                               <TableCell key={index}>{e}</TableCell>
                            ))}
                        </TableRow>
                   ))}
               </TableBody>
           </Table>
       </section>
    )
}
