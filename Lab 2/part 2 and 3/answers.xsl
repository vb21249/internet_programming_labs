<?xml version="1.0" encoding="UTF-8"?>
<!-- <?xml-stylesheet type="text/xsl" href="http://xsllab.com/answers.xsl" ?> -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">    
    <xsl:output method="html" indent="yes"/>
    <xsl:template match="/">
    <html>
        <head>
            <title>Answers</title>
            <link rel="stylesheet" type="text/css" href="styles.css"/>
        </head>
        <body>
            <h2>Answers</h2>
            <table border="1">
                <tr>
                    <th>Name</th>
                    <th>Language</th>
                    <th>Interests</th>
                    <th>Technologies</th>
                    <th>Goals</th>
                </tr>
                <xsl:for-each select="questionnaire/answer">
                    <tr>
                        <td><xsl:value-of select="name"/></td>
                        <td><xsl:value-of select="language"/></td>
                        <td><xsl:value-of select="interest"/></td>
                        <td><xsl:value-of select="technologies"/></td>
                        <td><xsl:value-of select="goals"/></td>
                    </tr>
                </xsl:for-each>
            </table>
        </body>
    </html>
    </xsl:template>
</xsl:stylesheet>