using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI;

[assembly: WebResource("DataTable.DataTable.script.table.js", "application/x-javascript")]
[assembly: WebResource("DataTable.DataTable.script.ExecutePageMethod.js", "application/x-javascript")]

namespace DataTable
{
    public class DataTableHelper
    {
        private const string TABLE_JS = "DataTable.DataTable.script.table.js";
        private const string PAGE_METHOD_JS = "DataTable.DataTable.script.ExecutePageMethod.js";

        public static void IncludeAll(ClientScriptManager manager)
        {
            IncludeJavaScript(manager, TABLE_JS);
            IncludeJavaScript(manager, PAGE_METHOD_JS);
        }

        private static void IncludeJavaScript(ClientScriptManager manager, string resourceName)
        {
            var type = typeof(DataTableHelper);
            manager.RegisterClientScriptResource(type, resourceName);
        }
    }
}
