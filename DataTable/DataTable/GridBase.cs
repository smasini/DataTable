using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataTable.DataTable
{
    public abstract class GridBase
    {
        const string DateFormat = "{0:dd/MM/yyy}";

        public abstract IEnumerable<object> GetEntities(int NumElements, int CurrentPage, object[] WhereParams, object[] OrderBy);

        public abstract int GetCount(object[] WhereParams);

        public abstract void OnSort(int PKRecordToMove, int PKRecordAfter);

        protected IEnumerable<object> Pagining(IEnumerable<object> objects, int NumElements, int CurrentPage)
        {
            int skip;
            if (CurrentPage == 1)
            {
                skip = 0;
            }
            else
            {
                skip = (CurrentPage - 1) * NumElements;
            }
            objects = objects.Skip(skip).Take(NumElements);
            return objects;
        }

        protected string GetDatetTimeFormat(DateTime? datetime)
        {
            if (datetime == null)
                return String.Empty;

            return String.Format(DateFormat, datetime);
        }
    }
}
