using System;
using System.Collections.Generic;
using System.Reflection;

namespace DataTable.DataTable
{
    public class TableCreator 
    {
        
        public static object MakeGrid(Type t, int MaxElementsForPage, int CurrentPage, object[] Filter, object[] Order)
        {
            var obj = Activator.CreateInstance(t);

            MethodInfo entitiesMethod = t.GetMethod("GetEntities");
            var entities = (IEnumerable<object>)entitiesMethod.Invoke(obj, new object[] { MaxElementsForPage, CurrentPage, Filter, Order });
            MethodInfo countMethod = t.GetMethod("GetCount");
            var count = (int)countMethod.Invoke(obj, new object[] { Filter });

            var totalPage = DivideRoundingUp(count, MaxElementsForPage);
            return new
            {
                Count = count,
                NumPage = totalPage,
                Entities = entities
            };
        }

        
        public static void ChangeOrder(Type t, int PKToMove, int PKToAfter)
        {
            var obj = Activator.CreateInstance(t);

            MethodInfo entitiesMethod = t.GetMethod("OnSort");
            entitiesMethod.Invoke(obj, new object[] { PKToMove, PKToAfter });
        }

        private static int DivideRoundingUp(int x, int y)
        {
            int remainder;
            int quotient = Math.DivRem(x, y, out remainder);
            return remainder == 0 ? quotient : quotient + 1;
        }
    }
}
