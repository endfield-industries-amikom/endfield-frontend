import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface SkeletonTableProps {
  columns: number;
  rows?: number;
}

export default function SkeletonTable({ columns, rows = 5 }: SkeletonTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableCell key={i}>
                <Skeleton variant="text" width="60%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, row) => (
            <TableRow key={row}>
              {Array.from({ length: columns }).map((_, col) => (
                <TableCell key={col}>
                  <Skeleton variant="text" width={col === 0 ? "80%" : "60%"} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
