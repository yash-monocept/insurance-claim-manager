"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto" {...props}>
    <table ref={ref} className="w-full caption-bottom text-sm" {...props} />
  </div>
))
Table.displayName = "Table"

export { Table }

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("[&_tr]:border-b font-bold text-muted-foreground", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50", className)} {...props} />
))
TableRow.displayName = "TableRow"

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {}
const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("text-left font-semibold text-muted-foreground h-10", className)}
    {...props}
  />
))
TableHead.displayName = "TableHead"

export interface TableCellProps extends React.HTMLAttributes<HTMLTableDataCellElement> {
  colSpan?: number
}
const TableCell = React.forwardRef<HTMLTableDataCellElement, TableCellProps>(({ className, colSpan, ...props }, ref) => (
  <td ref={ref} colSpan={colSpan} className={cn("p-3 h-10", className)} {...props} />
))
TableCell.displayName = "TableCell"

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
}
